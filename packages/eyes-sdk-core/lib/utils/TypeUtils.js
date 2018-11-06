'use strict';

const { hasOwnProperty, toString } = Object.prototype;

const BASE64_CHARS_PATTERN = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;

/**
 * Collection of utility methods.
 */
class TypeUtils {
  /**
   * Checks if `value` has a type `string` or created by the `String` constructor
   *
   * @param {*} value
   * @return {boolean}
   */
  static isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  /**
   * Checks if `value` has a type `number` or created by the `Number` constructor
   *
   * @param {*} value
   * @return {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
  }

  /**
   * Checks if `value` has a type `number` or created by the `Number` constructor and the value is integer
   *
   * @param {*} value
   * @return {boolean}
   */
  static isInteger(value) {
    return TypeUtils.isNumber(value) && Number.isInteger(value);
  }

  /**
   * Checks if `value` has a type `boolean` or created by the `Boolean` constructor
   *
   * @param {*} value
   * @return {boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean' || value instanceof Boolean;
  }

  /**
   * Checks if `value` has a type `object` and not `null`.
   *
   * @param {*} value
   * @return {boolean}
   */
  static isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  /**
   * Checks if `value` is a plain object. An object created by either `{}`, `new Object()` or `Object.create(null)`.
   *
   * @param {*} value
   * @return {boolean}
   */
  static isPlainObject(value) {
    if (!TypeUtils.isObject(value) || toString.call(value) !== '[object Object]') {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
  }

  /**
   * Checks if `value` is an array.
   *
   * @param {*} value
   * @return {boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * Checks if `value` is a Buffer.
   *
   * @param {*} value
   * @return {boolean}
   */
  static isBuffer(value) {
    return Buffer.isBuffer(value);
  }

  /**
   * Checks if `value` is a base64 string.
   *
   * @param {*} value
   * @return {boolean}
   */
  static isBase64(value) {
    return TypeUtils.isString(value) && BASE64_CHARS_PATTERN.test(value);
  }

  /**
   * Checks if `keys` is a direct property of `object`.
   *
   * @param {object} object The object to query.
   * @param {string|string[]} keys The key(s) to check.
   */
  static has(object, keys) {
    if (object == null) {
      return false;
    }

    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      if (!hasOwnProperty.call(object, key)) {
        return false;
      }
    }

    return true;
  }
}

exports.TypeUtils = TypeUtils;
