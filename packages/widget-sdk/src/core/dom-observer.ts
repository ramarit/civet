/**
 * DOM Mutation Observer
 * Watches for dynamic content changes and translates new text nodes
 */

import type { TextNode, MutationQueueItem, TranslationData } from '../types';
import { hashText, shouldTranslateNode, debounce } from '../utils/helpers';
import { Logger } from '../utils/helpers';

export class DOMObserver {
  private observer: MutationObserver | null;
  private logger: Logger;
  private excludeSelectors: string[];
  private mutationQueue: MutationQueueItem[];
  private isObserving: boolean;
  private batchCallback: ((nodes: TextNode[]) => void) | null;
  private processingDelay: number;

  constructor(
    excludeSelectors: string[],
    logger: Logger,
    processingDelay: number = 100
  ) {
    this.observer = null;
    this.logger = logger;
    this.excludeSelectors = excludeSelectors;
    this.mutationQueue = [];
    this.isObserving = false;
    this.batchCallback = null;
    this.processingDelay = processingDelay;
  }

  /**
   * Start observing DOM mutations
   */
  public start(callback: (nodes: TextNode[]) => void): void {
    if (this.isObserving) {
      this.logger.warn('DOMObserver is already observing');
      return;
    }

    this.batchCallback = callback;

    // Create debounced processor
    const debouncedProcess = debounce(
      this.processMutationQueue.bind(this),
      this.processingDelay
    );

    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations);
      debouncedProcess();
    });

    // Observe with optimized config
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: false
    });

    this.isObserving = true;
    this.logger.debugLog('DOMObserver started');
  }

  /**
   * Stop observing DOM mutations
   */
  public stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
      this.isObserving = false;
      this.mutationQueue = [];
      this.logger.debugLog('DOMObserver stopped');
    }
  }

  /**
   * Pause observation temporarily
   */
  public pause(): void {
    if (this.observer && this.isObserving) {
      this.observer.disconnect();
      this.isObserving = false;
      this.logger.debugLog('DOMObserver paused');
    }
  }

  /**
   * Resume observation
   */
  public resume(): void {
    if (this.observer && !this.isObserving) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: false
      });
      this.isObserving = true;
      this.logger.debugLog('DOMObserver resumed');
    }
  }

  /**
   * Handle mutation records
   */
  private handleMutations(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        this.handleChildListMutation(mutation);
      } else if (mutation.type === 'characterData') {
        this.handleCharacterDataMutation(mutation);
      }
    });
  }

  /**
   * Handle child list mutations (new nodes)
   */
  private handleChildListMutation(mutation: MutationRecord): void {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Extract text nodes from added element
        this.extractTextNodesFromElement(node as HTMLElement);
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Handle direct text node
        this.addTextNodeToQueue(node);
      }
    });
  }

  /**
   * Handle character data mutations (text changes)
   */
  private handleCharacterDataMutation(mutation: MutationRecord): void {
    const node = mutation.target;
    if (node.nodeType === Node.TEXT_NODE) {
      this.addTextNodeToQueue(node);
    }
  }

  /**
   * Extract text nodes from an element
   */
  private extractTextNodesFromElement(element: HTMLElement): void {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          return shouldTranslateNode(node, this.excludeSelectors)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      this.addTextNodeToQueue(node);
    }
  }

  /**
   * Add text node to processing queue
   */
  private addTextNodeToQueue(node: Node): void {
    if (!shouldTranslateNode(node, this.excludeSelectors)) {
      return;
    }

    const text = node.textContent?.trim();
    if (!text) return;

    const hash = hashText(text);

    // Check if already in queue
    const exists = this.mutationQueue.some(item => item.hash === hash);
    if (!exists) {
      this.mutationQueue.push({ text, node, hash });
    }
  }

  /**
   * Process queued mutations
   */
  private processMutationQueue(): void {
    if (this.mutationQueue.length === 0) return;

    const nodes: TextNode[] = this.mutationQueue.map(({ text, node, hash }) => ({
      text,
      node,
      hash
    }));

    this.logger.debugLog(`Processing ${nodes.length} new text nodes from mutations`);

    // Call callback with new nodes
    if (this.batchCallback) {
      this.batchCallback(nodes);
    }

    // Clear queue
    this.mutationQueue = [];
  }

  /**
   * Get observation status
   */
  public isActive(): boolean {
    return this.isObserving;
  }

  /**
   * Get queue size
   */
  public getQueueSize(): number {
    return this.mutationQueue.length;
  }

  /**
   * Force process current queue
   */
  public flush(): void {
    this.processMutationQueue();
  }
}
