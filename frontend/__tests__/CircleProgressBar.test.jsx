import React from 'react';
import { render, screen } from '@testing-library/react';
import CircleProgressBar from '../components/Dashboard Components/CircleProgressBar';

describe('CircleProgressBar Component', () => {
  it('renders with default props and displays 0%', () => {
    render(<CircleProgressBar />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders with custom percentage and shows it', () => {
    render(<CircleProgressBar percentage={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('sets correct strokeDashoffset for percentage', () => {
    const { container } = render(<CircleProgressBar percentage={50} />);
    const radius = 30;
    const dashArray = radius * Math.PI * 2;
    const expectedOffset = dashArray - (dashArray * 50) / 100;

    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1]; // The second <circle> is the progress circle
    const style = progressCircle.getAttribute('style');

    expect(style).toContain(`stroke-dashoffset: ${expectedOffset}`);
  });
});
