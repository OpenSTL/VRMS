import React from 'react';
import CreateAccountContainer from './createAccountContainer';
import { MemoryRouter } from 'react-router-dom';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  wait,
} from '@testing-library/react';
import service from '../../services/user.service';
import { mockUserData } from '../../utils/testUtils/mocks/authMock';

jest.mock('../../services/user.service', () => jest.fn());
service.checkUser = jest.fn(() => {
  return mockUserData;
});

beforeEach(() => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <CreateAccountContainer />
    </MemoryRouter>
  );
});

afterEach(cleanup);

describe('CreateAccount Container', () => {
  describe('Create Account Button', () => {
    test('Should be disabled by default', () => {
      expect(screen.getByText('Create Account')).toBeDisabled();
    });

    test('Should be disabled when the input value only contains spaces', () => {
      const createAccountInput = screen.getByTestId('create-account-input');
      fireEvent.change(createAccountInput, { target: { value: ' ' } });
      expect(screen.getByText('Create Account')).toBeDisabled();
    });

    test('Should be enabled when the input value isn`t empty', () => {
      expect(screen.getByText('Create Account')).toBeDisabled();
      const createAccountInput = screen.getByTestId('create-account-input');
      fireEvent.change(createAccountInput, { target: { value: 't' } });
      expect(screen.getByText('Create Account')).not.toBeDisabled();
      fireEvent.change(createAccountInput, { target: { value: 'test' } });
      expect(screen.getByText('Create Account')).not.toBeDisabled();
    });
  });

  test('Should display error message if email invalid', () => {
    const createAccountInput = screen.getByTestId('create-account-input');
    expect(createAccountInput).toBeInTheDocument();
    fireEvent.change(createAccountInput, { target: { value: 'test@gmail.c' } });
    fireEvent.submit(screen.getByTestId('create-account-form'));
    expect(
      screen.getByText('*Please enter a valid email address')
    ).toBeInTheDocument();
  });

  test('Should get user from UserService if user registered in the app', async () => {
    const createAccountInput = screen.getByTestId('create-account-input');
    expect(createAccountInput).toBeInTheDocument();
    fireEvent.change(createAccountInput, {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.submit(screen.getByTestId('create-account-form'));
    await wait(async () => {
      expect(() =>
        service.checkUser('test@gmail.com').toMatchObject(mockUserData)
      );
    });
  });

  test('Should display error message if user registered in the app', async () => {
    const createAccountInput = screen.getByTestId('create-account-input');
    expect(createAccountInput).toBeInTheDocument();
    fireEvent.change(createAccountInput, {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.submit(screen.getByTestId('create-account-form'));
    await screen.findByTestId('registered-user-error-msg');
  });
});
