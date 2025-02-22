'use strict';

const rule = require('../../../lib/rules/prefer-explicit-assert');
const { ALL_QUERIES_METHODS } = require('../../../lib/utils');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });
ruleTester.run('prefer-explicit-assert', rule, {
  valid: [
    {
      code: `getByText`,
    },
    {
      code: `const utils = render()
      
      utils.getByText
      `,
    },
    {
      code: `expect(getByText('foo')).toBeDefined()`,
    },
    {
      code: `const utils = render()
      
      expect(utils.getByText('foo')).toBeDefined()
      `,
    },
    {
      code: `expect(getByText('foo')).toBeInTheDocument();`,
    },
    {
      code: `async () => { await waitForElement(() => getByText('foo')) }`,
    },
    {
      code: `fireEvent.click(getByText('bar'));`,
    },
    {
      code: `const quxElement = getByText('qux')`,
    },
    {
      code: `() => { return getByText('foo') }`,
    },
    {
      code: `function bar() { return getByText('foo') }`,
    },
    {
      code: `getByIcon('foo')`, // custom `getBy` query not extended through options
    },
  ],

  invalid: [
    ...ALL_QUERIES_METHODS.map(queryMethod => ({
      code: `get${queryMethod}('foo')`,
      errors: [
        {
          messageId: 'preferExplicitAssert',
        },
      ],
    })),
    ...ALL_QUERIES_METHODS.map(queryMethod => ({
      code: `const utils = render()

      utils.get${queryMethod}('foo')`,
      errors: [
        {
          messageId: 'preferExplicitAssert',
          line: 3,
          column: 13,
        },
      ],
    })),
    ...ALL_QUERIES_METHODS.map(queryMethod => ({
      code: `() => {
        get${queryMethod}('foo')
        doSomething()

        get${queryMethod}('bar')
        const quxElement = get${queryMethod}('qux')
      }
      `,
      errors: [
        {
          messageId: 'preferExplicitAssert',
          line: 2,
        },
        {
          messageId: 'preferExplicitAssert',
          line: 5,
        },
      ],
    })),
    {
      code: `getByIcon('foo')`, // custom `getBy` query extended through options
      options: [
        {
          customQueryNames: ['getByIcon'],
        },
      ],
      errors: [
        {
          messageId: 'preferExplicitAssert',
        },
      ],
    },
  ],
});
