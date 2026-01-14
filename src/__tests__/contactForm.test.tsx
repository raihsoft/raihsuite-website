import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from '@/app/contact/page';

describe('ContactPage form', () => {
  it('shows validation errors if fields empty', async () => {
    render(<ContactPage />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Name is too short/i)).toBeInTheDocument();
    });
  });
});