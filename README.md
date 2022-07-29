# TyCheck

TyCheck is a library used to make types both JavaScript and TypeScript and check them at runtime.

## Install

On your project, using npm (or any other node package manager).

```shell
npm i tycheck
```

## Usage

### Simple usage

```typescript
import { typeChecker, typeString } from 'tycheck';

const checker = typeChecker(typeString);

const validString = checker('Valid string'); // validString will have "Valid string" value
const invalidString = checker(42); // The checker will throw a type error
```

### More complex usage

```typescript
import { beArray, typeBoolean, typeChecker, typeNumber, beInterface, typeString } from 'tycheck';

const checker = typeChecker(
  beInterface({
    string: typeString,
    boolean: typeBoolean,
    array: beArray(typeNumber)
  })
);

type CheckedType = ReturnType<typeof checker>;

const checkedValue = checker({
  string: 'string value',
  boolean: true,
  array: [33, 42],
}); // Will pass and be type of CheckedType (by inference)
```

## Contribute

Just create a Pull Request with your contribution.

The Pull Request is used to add/remove code but also as a discussion place to know if the contribution is relevant.

### Install

```shell
npm i
```

### Tests

```shell
npm test
```

### Build

```shell
npm run build
```
