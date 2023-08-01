/*
* <license header>
*/

jest.mock('@adobe/aio-sdk', () => ({
  Core: {
    Logger: jest.fn(),
  },
}));

const { Core } = require('@adobe/aio-sdk');
const mockLoggerInstance = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };
Core.Logger.mockReturnValue(mockLoggerInstance);

const { unPublishTranslations } = require('../actions/translations.js');
jest.mock('../actions/translations.js', () => ({
  ...jest.requireActual('../actions/translations.js'),
  unPublishTranslations: jest.fn(),
}));

const action = require('./../actions/unpublish-translations/index.js');

beforeEach(() => {
  Core.Logger.mockClear();
  mockLoggerInstance.info.mockReset();
  mockLoggerInstance.debug.mockReset();
  mockLoggerInstance.error.mockReset();
});

const fakeParams = {
  __ow_headers: { authorization: 'Bearer fake' },
  authConfig: { authScheme: "Bearer"},
  selection: { test },
  aemHost: "host",
};
describe('unpublish-translations', () => {
  test('main should be defined', () => {
    expect(action.main).toBeInstanceOf(Function);
  });
  test('should set logger to use LOG_LEVEL param', async () => {
    await action.main({ ...fakeParams, LOG_LEVEL: 'fakeLevel' });
    expect(Core.Logger).toHaveBeenCalledWith(expect.any(String), { level: 'fakeLevel' });
  });
  test('should return an http response with the fetched content', async () => {
    unPublishTranslations.mockResolvedValue(Promise.resolve({}));

    const response = await action.main(fakeParams);
    expect(response).toEqual({
      statusCode: 200,
      body: fakeParams.selection,
    });
  });
  test('if there is an error should return a 500 and log the error', async () => {
    const fakeError = new Error('fake');
    unPublishTranslations.mockRejectedValue(fakeError);

    const response = await action.main(fakeParams);
    expect(response).toEqual({
      error: {
        statusCode: 500,
        body: { error: 'server error' },
      },
    });
    expect(mockLoggerInstance.error).toHaveBeenCalledWith(fakeError);
  });
  test('missing input request parameters, should return 400', async () => {
    const response = await action.main({});
    expect(response).toEqual({
      error: {
        statusCode: 400,
        body: { error: 'missing parameter(s) \'authConfig,selection,aemHost\'' },
      },
    });
  });
});
