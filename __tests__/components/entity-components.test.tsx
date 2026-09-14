import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  EntitySearch,
  EntityPagination,
  LoadingView,
  ErrorView,
  EmptyView,
} from '@/components/entity-components';

describe('EntitySearch', () => {
  it('renders input with placeholder and calls onChange on typing', () => {
    const onChange = vi.fn();
    render(<EntitySearch value="" onChange={onChange} placeholder="Find it" />);

    const input = screen.getByPlaceholderText('Find it');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello');
  });
});

describe('EntityPagination', () => {
  const setup = (page: number, totalPages: number) => {
    const onPageChange = vi.fn();
    render(
      <EntityPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />,
    );
    return { onPageChange };
  };

  it('disables Previous on first page and enables Next', () => {
    setup(1, 3);
    expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(false);
  });

  it('disables Next when there is no next page', () => {
    setup(3, 3);
    expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(false);
  });

  it('disables both buttons when totalPages is 0', () => {
    setup(1, 0);
    expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true);
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const { onPageChange } = setup(2, 3);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const { onPageChange } = setup(2, 3);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});

describe('State views', () => {
  it('LoadingView renders its message', () => {
    render(<LoadingView message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeTruthy();
  });

  it('ErrorView renders its message', () => {
    render(<ErrorView message="Something broke" />);
    expect(screen.getByText('Something broke')).toBeTruthy();
  });

  it('EmptyView renders title, message and calls onNew from button', () => {
    const onNew = vi.fn();
    render(<EmptyView message="No workflows yet" onNew={onNew} />);
    expect(screen.getByText('No items')).toBeTruthy();
    expect(screen.getByText('No workflows yet')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('EmptyView hides the Add item button without onNew', () => {
    render(<EmptyView message="empty" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
