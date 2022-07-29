import { describe, expect, it } from 'vitest';

import { beArray, typeBoolean, typeChecker, typeNumber, beInterface, typeString, beOption } from './TyCheck';

describe('TypeCheck', () => {
  describe('String', () => {
    it('Should fail when not', () => {
      expect(() => typeChecker(typeString)(42)).toThrow('Type is incorrect, wanted string but given number');
    });
    it('Should get', () => {
      expect(typeChecker(typeString)('some string')).toBe('some string');
    });
  });
  describe('Number', () => {
    it('Should fail when not', () => {
      expect(() => typeChecker(typeNumber)('some string')).toThrow('Type is incorrect, wanted number but given string');
    });
    it('Should get', () => {
      expect(typeChecker(typeNumber)(42)).toBe(42);
    });
  });
  describe('Boolean', () => {
    it('Should fail when not', () => {
      expect(() => typeChecker(typeBoolean)('some string')).toThrow('Type is incorrect, wanted boolean but given string');
    });
    it('Should get', () => {
      expect(typeChecker(typeBoolean)(false)).toBe(false);
    });
  });

  describe('Interface', () => {
    const interfaceChecker = typeChecker(
      beInterface({
        str: typeString,
        num: typeNumber,
        deep: beInterface({
          value: typeString,
        }),
      })
    );

    it('Should fail when not', () => {
      expect(() => interfaceChecker('not an object')).toThrow(/object/);
    });

    it('Should fail when fields not check', () => {
      expect(() => interfaceChecker({ str: 42 })).toThrow(/On field "str":(.+)string/);
    });

    it('Should fail when fields does not exists', () => {
      expect(() => interfaceChecker({})).toThrow('On field "str": missing value');
    });

    it('Should fail on error deeper', () => {
      expect(() => interfaceChecker({ str: 'some string', num: 42, deep: { value: true } })).toThrow(
        /On field "deep": On field "value": (.+)string(.+)boolean/
      );
    });

    it('Should get', () => {
      expect(
        interfaceChecker({
          str: 'some string',
          num: 42,
          deep: {
            value: 'deep value',
          },
        })
      ).toEqual({
        str: 'some string',
        num: 42,
        deep: {
          value: 'deep value',
        },
      });
    });
  });

  describe('Array', () => {
    const arrayChecker = beArray(
      beInterface({
        name: typeString,
        age: typeNumber,
      })
    );

    it('Should fail when not', () => {
      expect(() => arrayChecker('not an array')).toThrow(/array/);
    });

    it('Should fail when fields not check', () => {
      expect(() => arrayChecker([42])).toThrow(/number/);
    });

    it('Should get', () => {
      expect(
        arrayChecker([
          { name: 'John', age: 33 },
          { name: 'Alice', age: 42 },
        ])
      ).toEqual([
        { name: 'John', age: 33 },
        { name: 'Alice', age: 42 },
      ]);
    });
  });

  describe('Option', () => {
    it('Should fail when not', () => {
      expect(() => beOption(typeNumber)('Not a number')).toThrow(/number/);
    });

    it('Should accept undefined', () => {
      expect(beOption(typeNumber)(undefined)).toBeUndefined();
    });

    it('Should get', () => {
      expect(beOption(typeNumber)(42)).toBe(42);
    });
  });
});
