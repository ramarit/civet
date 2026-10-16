import { db } from '../db/client.js';
import type { Translation, UpdateTranslationRequest, BatchTranslationRequest } from '../types/index.js';
import { NotFoundError } from '../middleware/error-handler.js';

export class TranslationService {
  async getByProject(projectId: string, languageCode: string): Promise<Record<string, string>> {
    const result = await db.query<Translation>(
      `SELECT key, value FROM translations
       WHERE project_id = $1 AND language_code = $2`,
      [projectId, languageCode]
    );

    // Convert to key-value object
    const translations: Record<string, string> = {};
    for (const row of result.rows) {
      translations[row.key] = row.value;
    }

    return translations;
  }

  async getAll(projectId: string): Promise<Translation[]> {
    const result = await db.query<Translation>(
      `SELECT * FROM translations
       WHERE project_id = $1
       ORDER BY key, language_code`,
      [projectId]
    );

    return result.rows;
  }

  async getBulk(projectId: string, keys: string[], languageCode: string): Promise<Record<string, string>> {
    const result = await db.query<Translation>(
      `SELECT key, value FROM translations
       WHERE project_id = $1 AND language_code = $2 AND key = ANY($3)`,
      [projectId, languageCode, keys]
    );

    const translations: Record<string, string> = {};
    for (const row of result.rows) {
      translations[row.key] = row.value;
    }

    return translations;
  }

  async update(projectId: string, data: UpdateTranslationRequest): Promise<Translation> {
    const result = await db.query<Translation>(
      `INSERT INTO translations (project_id, key, language_code, value)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (project_id, key, language_code)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [projectId, data.key, data.language_code, data.value]
    );

    return result.rows[0];
  }

  async batchUpdate(data: BatchTranslationRequest): Promise<number> {
    if (data.translations.length === 0) {
      return 0;
    }

    return db.transaction(async (client) => {
      let updatedCount = 0;

      for (const translation of data.translations) {
        const result = await client.query(
          `INSERT INTO translations (project_id, key, language_code, value)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (project_id, key, language_code)
           DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
          [data.project_id, translation.key, translation.language_code, translation.value]
        );

        updatedCount += result.rowCount || 0;
      }

      return updatedCount;
    });
  }

  async delete(projectId: string, key: string, languageCode: string): Promise<void> {
    const result = await db.query(
      `DELETE FROM translations
       WHERE project_id = $1 AND key = $2 AND language_code = $3`,
      [projectId, key, languageCode]
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Translation not found');
    }
  }

  async deleteKey(projectId: string, key: string): Promise<void> {
    await db.query(
      'DELETE FROM translations WHERE project_id = $1 AND key = $2',
      [projectId, key]
    );
  }

  async getLanguages(projectId: string): Promise<Array<{ language_code: string; language_name: string; enabled: boolean }>> {
    const result = await db.query(
      `SELECT language_code, language_name, enabled
       FROM project_languages
       WHERE project_id = $1
       ORDER BY language_name`,
      [projectId]
    );

    return result.rows;
  }

  async enableLanguage(projectId: string, languageCode: string, languageName: string): Promise<void> {
    await db.query(
      `INSERT INTO project_languages (project_id, language_code, language_name, enabled)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (project_id, language_code)
       DO UPDATE SET enabled = true, language_name = EXCLUDED.language_name`,
      [projectId, languageCode, languageName]
    );
  }

  async disableLanguage(projectId: string, languageCode: string): Promise<void> {
    await db.query(
      `UPDATE project_languages
       SET enabled = false
       WHERE project_id = $1 AND language_code = $2`,
      [projectId, languageCode]
    );
  }

  async getTranslationStats(projectId: string): Promise<{
    totalKeys: number;
    languageStats: Array<{ language_code: string; translated: number; percentage: number }>;
  }> {
    // Get total unique keys
    const keysResult = await db.query(
      `SELECT COUNT(DISTINCT key) as count
       FROM translations
       WHERE project_id = $1`,
      [projectId]
    );

    const totalKeys = parseInt(keysResult.rows[0].count);

    // Get translation count per language
    const statsResult = await db.query(
      `SELECT language_code, COUNT(*) as translated
       FROM translations
       WHERE project_id = $1
       GROUP BY language_code`,
      [projectId]
    );

    const languageStats = statsResult.rows.map((row) => ({
      language_code: row.language_code,
      translated: parseInt(row.translated),
      percentage: totalKeys > 0 ? (parseInt(row.translated) / totalKeys) * 100 : 0,
    }));

    return { totalKeys, languageStats };
  }
}

export const translationService = new TranslationService();
