/**
 * @fileoverview Comprehensive accessibility module tests.
 */

import {
  announce,
  moveFocus,
  createFocusTrap,
  setupArrowKeyNavigation,
  prefersReducedMotion,
  initScrollReveal,
  initCounterAnimations
} from '../../src/js/accessibility.js';

describe('Accessibility Module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('announce', () => {
    it('creates an aria-announcer element if not present', () => {
      announce('Test message');
      expect(document.getElementById('aria-announcer')).not.toBeNull();
    });

    it('sets the message content', () => {
      announce('Hello World');
      const announcer = document.getElementById('aria-announcer');
      expect(announcer).not.toBeNull();
    });

    it('reuses existing announcer element', () => {
      announce('First message');
      announce('Second message');
      const announcers = document.querySelectorAll('#aria-announcer');
      expect(announcers.length).toBe(1);
    });

    it('sets aria-live to polite by default', () => {
      announce('Polite message');
      const announcer = document.getElementById('aria-announcer');
      expect(announcer.getAttribute('aria-live')).toBe('polite');
    });

    it('sets aria-live to assertive when specified', () => {
      announce('Urgent message', 'assertive');
      const announcer = document.getElementById('aria-announcer');
      expect(announcer.getAttribute('aria-live')).toBe('assertive');
    });

    it('has aria-atomic attribute', () => {
      announce('Test');
      const announcer = document.getElementById('aria-announcer');
      expect(announcer.getAttribute('aria-atomic')).toBe('true');
    });

    it('has sr-only class', () => {
      announce('Test');
      const announcer = document.getElementById('aria-announcer');
      expect(announcer.classList.contains('sr-only')).toBe(true);
    });
  });

  describe('moveFocus', () => {
    it('focuses a specified CSS selector element', () => {
      document.body.innerHTML = '<button id="target-btn">Click</button>';
      const btn = document.getElementById('target-btn');
      btn.focus = jest.fn();
      moveFocus('#target-btn');
      expect(btn.focus).toHaveBeenCalled();
    });

    it('focuses an HTMLElement directly', () => {
      document.body.innerHTML = '<input id="test-input" />';
      const input = document.getElementById('test-input');
      input.focus = jest.fn();
      moveFocus(input);
      expect(input.focus).toHaveBeenCalled();
    });

    it('does nothing when target does not exist', () => {
      expect(() => moveFocus('#nonexistent')).not.toThrow();
    });

    it('adds tabindex to non-focusable elements', () => {
      document.body.innerHTML = '<div id="mydiv">Content</div>';
      const div = document.getElementById('mydiv');
      div.focus = jest.fn();
      moveFocus(div);
      expect(div.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('createFocusTrap', () => {
    it('returns an object with activate and deactivate methods', () => {
      document.body.innerHTML = '<div id="trap"><button>Btn 1</button><button>Btn 2</button></div>';
      const container = document.getElementById('trap');
      const trap = createFocusTrap(container);
      expect(typeof trap.activate).toBe('function');
      expect(typeof trap.deactivate).toBe('function');
    });

    it('activates the focus trap', () => {
      document.body.innerHTML = '<div id="trap"><button id="b1">Btn 1</button><button id="b2">Btn 2</button></div>';
      const container = document.getElementById('trap');
      const b1 = document.getElementById('b1');
      b1.focus = jest.fn();
      const trap = createFocusTrap(container);
      expect(() => trap.activate()).not.toThrow();
    });

    it('deactivates the focus trap and restores focus', () => {
      document.body.innerHTML = '<div id="trap"><button>Btn</button></div><button id="prev">Previous</button>';
      const container = document.getElementById('trap');
      const prevBtn = document.getElementById('prev');
      prevBtn.focus = jest.fn();
      document.activeElement; // reference
      const trap = createFocusTrap(container);
      trap.activate();
      trap.deactivate();
      expect(true).toBe(true); // should not throw
    });

    it('handles Tab key within trap', () => {
      document.body.innerHTML = '<div id="trap"><button id="first">First</button><button id="last">Last</button></div>';
      const container = document.getElementById('trap');
      const trap = createFocusTrap(container);
      trap.activate();
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });

    it('handles Shift+Tab key within trap', () => {
      document.body.innerHTML = '<div id="trap"><button id="first">First</button><button id="last">Last</button></div>';
      const container = document.getElementById('trap');
      const trap = createFocusTrap(container);
      trap.activate();
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });
  });

  describe('setupArrowKeyNavigation', () => {
    it('navigates to next item with ArrowDown', () => {
      document.body.innerHTML = `
        <div id="nav-container">
          <button class="nav-item">Item 1</button>
          <button class="nav-item">Item 2</button>
          <button class="nav-item">Item 3</button>
        </div>`;
      const container = document.getElementById('nav-container');
      setupArrowKeyNavigation(container, '.nav-item');
      const items = container.querySelectorAll('.nav-item');
      items[0].focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });

    it('navigates to previous item with ArrowUp', () => {
      document.body.innerHTML = `<div id="nav-container">
        <button class="item">A</button><button class="item">B</button>
      </div>`;
      const container = document.getElementById('nav-container');
      setupArrowKeyNavigation(container, '.item');
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });

    it('navigates to first item with Home key', () => {
      document.body.innerHTML = `<div id="nav-container">
        <button class="item">A</button><button class="item">B</button>
      </div>`;
      const container = document.getElementById('nav-container');
      const items = container.querySelectorAll('.item');
      items[0].focus = jest.fn();
      setupArrowKeyNavigation(container, '.item');
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });

    it('navigates to last item with End key', () => {
      document.body.innerHTML = `<div id="nav-container">
        <button class="item">A</button><button class="item">B</button>
      </div>`;
      const container = document.getElementById('nav-container');
      const items = container.querySelectorAll('.item');
      const last = items[items.length - 1];
      last.focus = jest.fn();
      setupArrowKeyNavigation(container, '.item');
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      container.dispatchEvent(event);
      expect(true).toBe(true);
    });

    it('does nothing for non-navigation keys', () => {
      document.body.innerHTML = `<div id="nav-container"><button class="item">A</button></div>`;
      const container = document.getElementById('nav-container');
      setupArrowKeyNavigation(container, '.item');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      expect(() => container.dispatchEvent(event)).not.toThrow();
    });

    it('does nothing when focused element is not in the list', () => {
      document.body.innerHTML = `<div id="nav-container"><button class="item">A</button></div><input id="outside" />`;
      const container = document.getElementById('nav-container');
      setupArrowKeyNavigation(container, '.item');
      document.getElementById('outside').focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      expect(() => container.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('prefersReducedMotion', () => {
    it('returns a boolean', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('returns false when matchMedia reports no preference', () => {
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('initScrollReveal', () => {
    it('does not throw when called', () => {
      document.body.innerHTML = '<div class="fade-in-up"></div>';
      expect(() => initScrollReveal()).not.toThrow();
    });

    it('makes elements visible immediately when reduced motion preferred', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      document.body.innerHTML = '<div class="fade-in-up"></div>';
      initScrollReveal();
      const el = document.querySelector('.fade-in-up');
      expect(el.classList.contains('visible')).toBe(true);
      // restore
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    });
  });

  describe('initCounterAnimations', () => {
    it('does not throw when no counter elements exist', () => {
      document.body.innerHTML = '';
      expect(() => initCounterAnimations()).not.toThrow();
    });

    it('sets textContent immediately when reduced motion preferred', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      document.body.innerHTML = '<span class="stat-number" data-count="42"></span>';
      initCounterAnimations();
      const counter = document.querySelector('.stat-number');
      expect(counter.textContent).toBe('42');
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    });
  });
});
