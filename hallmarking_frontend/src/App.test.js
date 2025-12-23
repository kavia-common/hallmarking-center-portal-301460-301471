import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header brand', () => {
  render(<App />);
  const brand = screen.getByText(/Hallmarking Center/i);
  expect(brand).toBeInTheDocument();
});
