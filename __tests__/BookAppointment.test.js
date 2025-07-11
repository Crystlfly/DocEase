import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BookAppointment from '../pages/patient/book-appointment';
import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react';


describe('BookAppointment Page', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mocks before every test
  });

  test('renders page heading "Available Doctors"', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ name: "Smith" }]),
      })
    );

    render(<BookAppointment />);
    await waitFor(() =>
      expect(screen.getByText(/Available Doctors/i)).toBeInTheDocument()
    );
  });

  test('renders doctor cards when data is fetched', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { _id: "1", name: "Smith", specialization: "Cardiology" },
          { _id: "2", name: "Anusha", specialization: "Neurology" }
        ]),
      })
    );

    render(<BookAppointment />);
    await waitFor(() => {
      expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
      expect(screen.getByText("Dr. Anusha")).toBeInTheDocument();
    });
  });

  test("shows booking form when a doctor is selected", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { _id: "1", name: "Smith", specialization: "Cardiology" },
          ]),
      })
    );

    render(<BookAppointment />);
    
    // Simulate selecting a doctor
    await waitFor(() => {
      fireEvent.click(screen.getByText("Dr. Smith")); // or use getByRole, etc.
    });

    // Check that booking form is now visible
    expect(screen.getByLabelText("Reason:")).toBeInTheDocument();
    expect(screen.getByLabelText("Date:")).toBeInTheDocument();
  });

  test("submits appointment form successfully", async () => {
  global.fetch = jest.fn()
    // 1st call: fetch doctors
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: "1", name: "Smith", specialization: "Cardiology" },
      ],
    })
    // 2nd call: fetch available slots
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        availableSlots: ["2:00 PM", "2:30 PM"],
      }),
    })
    // 3rd call: book appointment
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        appointmentID: "xyz123",
      }),
    });

  render(<BookAppointment />);

  // Select doctor
  await waitFor(() => {
    fireEvent.click(screen.getByText("Dr. Smith"));
  });

  // Fill form
  fireEvent.change(screen.getByLabelText("Date:"), {
    target: { value: "2025-07-05" },
  });

  await waitFor(() =>
    expect(screen.getByLabelText("Time Slot:")).toBeEnabled()
  );

  fireEvent.change(screen.getByLabelText("Time Slot:"), {
    target: { value: "2:00 PM" },
  });

  fireEvent.change(screen.getByLabelText("Reason:"), {
    target: { value: "Follow-up checkup" },
  });

  // Submit
  fireEvent.click(screen.getByRole("button", { name: /Book Appointment/i }));

  // Assert confirmation
  expect(await screen.findByText(/Appointment booked!/i)).toBeInTheDocument();
});


  test("shows validation error when fields are empty", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { _id: "1", name: "Smith", specialization: "Cardiology" },
          ]),
      })
    );
    render(<BookAppointment />);
    await waitFor(() => {
        fireEvent.click(screen.getByText("Dr. Smith"));
      });
    fireEvent.click(screen.getByRole("button", { name: /Book Appointment/i }));

    expect(await screen.findByText(/Please fill all fields/i)).toBeInTheDocument();
  });


  test('shows error message if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress error logs
    render(<BookAppointment />);

    await waitFor(() => {
      // Since you don’t show a UI error, we can check if console.error was called
      expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });
});
