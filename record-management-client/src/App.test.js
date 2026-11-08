import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('shows the sign-in screen when there is no saved session', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  expect(screen.getByLabelText('Username')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});

test('switches to signup and validates matching passwords', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));

  expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'different123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

  expect(screen.getByRole('alert')).toHaveTextContent('The passwords do not match.');
});
