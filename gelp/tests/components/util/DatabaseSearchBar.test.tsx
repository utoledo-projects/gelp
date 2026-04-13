/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DatabaseSearchBar from '@/components/util/DatabaseSearchBar';
import userEvent from '@testing-library/user-event';

global.fetch = jest.fn();

describe('DatabaseSearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders search input', () => {
    render(<DatabaseSearchBar />);
    expect(screen.getByPlaceholderText('Search games...')).toBeInTheDocument();
  });

  it('debounces API calls by 1 second', async () => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<DatabaseSearchBar />);
    const input = screen.getByPlaceholderText('Search games...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Elden' } });
    expect(global.fetch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(global.fetch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(global.fetch).toHaveBeenCalledWith('/api/games/search?q=Elden');
  });

  it('displays search results in dropdown', async () => {
    const mockResults = [
      { id: '1', title: 'Elden Ring' },
      { id: '2', title: 'Elder Scrolls V' },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    });

    render(<DatabaseSearchBar />);
    const input = screen.getByPlaceholderText('Search games...');

    await userEvent.type(input, 'Elden');

    await waitFor(() => {
      expect(screen.getByText('Elden Ring')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('closes dropdown when clicking outside', async () => {
    const mockResults = [{ id: '1', title: 'Elden Ring' }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    });

    render(<DatabaseSearchBar />);
    const input = screen.getByPlaceholderText('Search games...');

    await userEvent.type(input, 'Elden');

    await waitFor(() => {
      expect(screen.getByText('Elden Ring')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Elden Ring')).not.toBeInTheDocument();
    });
  });

  it('links to correct game page', async () => {
    const mockResults = [{ id: '123', title: 'Elden Ring' }];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    });

    render(<DatabaseSearchBar />);
    const input = screen.getByPlaceholderText('Search games...');

    await userEvent.type(input, 'Elden');

    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'Elden Ring' });
      expect(link).toHaveAttribute('href', '/game/123');
    }, { timeout: 2000 });
  });
});