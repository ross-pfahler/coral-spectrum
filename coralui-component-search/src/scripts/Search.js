/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

import Component from 'coralui-mixin-component';
import FormField from 'coralui-mixin-formfield';
import 'coralui-component-textfield';
import 'coralui-component-button';
import base from '../templates/base';
import {transform, validate, commons} from 'coralui-util';

const CLASSNAME = 'coral3-Search';

/**
 Enum for search variant values.
 
 @enum {String}
 @memberof Coral.Search
 */
const variant = {
  /** A default, gray search input */
  DEFAULT: 'default',
  /** A search with no border, no background, no glow */
  QUIET: 'quiet'
};

/**
 @class Coral.Search
 @classdesc A Search component
 @htmltag coral-search
 @extends HTMLElement
 @extends Coral.mixin.component
 @extends Coral.mixin.formField
 */
class Search extends FormField(Component(HTMLElement)) {
  constructor() {
    super();
  
    this._delegateEvents(commons.extend(this._events, {
      // @todo use Coral.keys when key combos don't interfere with single key execution
      'keydown [handle=input]': '_onEnterKey',
      'keyup [handle=input]': '_onKeyUp',
  
      // @todo use coralinternalinput from Autocomplete
      'input [handle=input]': '_triggerInputEvent',
  
      'key:escape [handle=input]': '_clearInput',
      'click [handle=clearButton]:not(:disabled)': '_clearInput'
    }));
    
    // Prepare templates
    this._elements = {};
    base.call(this._elements);
  }
  
  // JSDoc inherited
  get name() {
    return this._elements.input.name;
  }
  set name(value) {
    this._reflectAttribute('name', value);
    
    this._elements.input.name = value;
  }
  
  /**
   The value this radio should submit when checked. Changing this value will not trigger an event.
   
   @type {String}
   @default "on"
   @htmlattribute value
   @memberof Coral.Radio#
   */
  get value() {
    return this._elements.input.value || 'on';
  }
  set value(value) {
    this._elements.input.value = value;
  }
  
  // JSDoc inherited
  get disabled() {
    return this._disabled || false;
  }
  set disabled(value) {
    this._disabled = transform.booleanAttr(value);
    this._reflectAttribute('disabled', this._disabled);
    
    this.setAttribute('aria-disabled', this._disabled);
    this.classList.toggle('is-disabled', this._disabled);
    this._elements.input.disabled = this._disabled;
    this._elements.clearButton.disabled = this._disabled;
  }
  
  // JSDoc inherited
  get required() {
    return this._required || false;
  }
  set required(value) {
    this._required = transform.booleanAttr(value);
    this._reflectAttribute('required', this._required);
    
    this.setAttribute('aria-required', this._required);
    this._elements.input.required = this._required;
  }
  
  // JSDoc inherited
  get readOnly() {
    return this._readOnly || false;
  }
  set readOnly(value) {
    this._readOnly = transform.booleanAttr(value);
    this._reflectAttribute('readonly', this._readOnly);
    
    this.setAttribute('aria-readonly', this._readOnly);
    this._elements.input.readOnly = this._readOnly;
    this._elements.clearButton.disabled = this._readOnly;
  }
  
  // JSDoc inherited
  get invalid() {
    return super.invalid;
  }
  set invalid(value) {
    super.invalid = value;
    this._elements.input.invalid = this._invalid;
  }
  
  // JSDoc inherited
  get labelledBy() {
    return super.labelledBy;
  }
  set labelledBy(value) {
    super.labelledBy = value;
    // in case the user focuses the buttons, he will still get a notion of the usage of the component
    this[this.labelledBy ? 'setAttribute' : 'removeAttribute']('aria-labelledby', this.labelledBy);
  }
  
  /**
   Short hint that describes the expected value of the Search. It is displayed when the Search is empty.
   
   @type {String}
   @default ""
   @htmlattribute placeholder
   @htmlattributereflected
   @memberof Coral.Search#
   */
  get placeholder(){
    return this._elements.input.placeholder || '';
  }
  set placeholder(value) {
    value = transform.string(value);
    this._reflectAttribute('placeholder', value);
  
    this._elements.input.placeholder = value;
  }
  
  /**
   Max length for the Input field.
   @type {Long}
   @htmlattribute maxlength
   @htmlattributereflected
   @memberof Coral.Search#
   */
  get maxLength() {
    return this._elements.input.maxLength;
  }
  set maxLength(value) {
    this._elements.input.maxLength = value;
    this._reflectAttribute('maxlength', this.maxLength);
  }
  
  /**
   This sets the left icon on the search component.
   
   @type {String}
   @default "search"
   @htmlattribute icon
   @htmlattributereflected
   @memberof Coral.Search#
   */
  get icon() {
    return this._elements.icon.icon || 'search';
  }
  set icon(value) {
    this._elements.icon.icon = value;
    if (this._elements.icon.icon) {
      this._reflectAttribute('icon', this._elements.icon.icon);
    }
    // Hide if no icon provided
    this._elements.icon.hidden = !this._elements.icon.icon;
  }
  
  /**
   The search's variant.
   
   @type {Coral.Search.variant}
   @default Coral.Search.variant.DEFAULT
   @htmlattribute variant
   @htmlattributereflected
   @memberof Coral.Search#
   */
  get variant() {
    return this._variant || variant.DEFAULT;
  }
  set variant(value) {
    value = transform.string(value).toLowerCase();
    this._variant = validate.enumeration(variant)(value) && value || variant.DEFAULT;
    this._reflectAttribute('variant', this._variant);
    
    this._elements.input.variant = value;
  }
  
  /** @ignore */
  _triggerInputEvent() {
    this.trigger('coral-search:input');
  }
  
  /**
   Handles the up action by steping up the Search. It prevents the default action.
   
   @ignore
   */
  _onEnterKey(event) {
    if (event.which === 13) {
      event.preventDefault();
    
      // stops interaction if the search is disabled
      if (this.disabled) {
        return;
      }
    
      this.trigger('coral-search:submit');
    }
  }
  
  /**
   Handles the keydown action.
   
   @ignore
   */
  _onKeyUp(event) {
    this._updateClearButton();
  }
  
  /**
   Updates the clear button's display status.
   
   @ignore
   */
  _updateClearButton() {
    if (this._elements.input.value === '') {
      this._elements.clearButton.style.display = 'none';
    }
    else {
      this._elements.clearButton.style.display = '';
    }
  }
  
  /**
   Clears the text in the input box.
   
   @ignore
   */
  _clearInput(event) {
    this._elements.input.value = '';
    this._updateClearButton();
    this._elements.input.focus();
  
    // If we've been cleared, trigger the event
    this.trigger('coral-search:clear');
  }
  
  /**
   Modified to target the input instead of the button.
 
   @private
   */
  _getLabellableElement() {
    return this._elements.input;
  }
  
  // overrides the behavior from mixin-formfield
  reset() {
    // since there is an internal value, this one handles the reset
    this._elements.input.reset();
  }
  
  // overrides the behavior from mixin-formfield
  clear() {
    // since there is an internal value, this one handles the clear
    this._elements.input.clear();
  }
  
  // Expose enumerations
  static get variant() {return variant;}
  
  static get observedAttributes() {
    return super.observedAttributes.concat(['placeholder', 'icon', 'variant', 'maxlength', 'maxLength']);
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    this.classList.add(CLASSNAME);
    this.classList.add('coral-DecoratedTextfield');
  
    // Default reflected attributes
    if (!this._icon) {this.icon = 'search';}
    if (!this._variant) {this.variant = variant.DEFAULT;}
  
    // Create a temporary fragment
    const fragment = document.createDocumentFragment();
  
    const templateHandleNames = ['icon', 'input', 'clearButton'];
  
    // Render the main template
    fragment.appendChild(this._elements.icon);
    fragment.appendChild(this._elements.input);
    fragment.appendChild(this._elements.clearButton);
    
    // Process remaining elements as necessary
    while (this.firstChild) {
      const child = this.firstChild;
      if (child.nodeType === Node.TEXT_NODE ||
        (child.nodeType === Node.ELEMENT_NODE && templateHandleNames.indexOf(child.getAttribute('handle')) === -1)) {
        // Add non-template elements to the fragment
        fragment.appendChild(child);
      }
      else {
        // Remove anything else
        this.removeChild(child);
      }
    }
  
    // Add the frag to the component
    this.appendChild(fragment);
  
    this._updateClearButton();
  }
  
  /**
   Triggered when input is given.
   
   @event Coral.Search#coral-search:input
   
   @param {Object} event
   Event object.
   */
  
  /**
   Triggered when the user presses enter.
   
   @event Coral.Search#coral-search:submit
   
   @param {Object} event
   Event object.
   */
  
  /**
   Triggered when the search is cleared.
   
   @event Coral.Search#coral-search:clear
   
   @param {Object} event
   Event object.
   */
}

export default Search;
