import { describe, expect, it } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

describe('Create Appointment', () => {
  it('should be able to create an appointment', () => {
    const startsAt = getFutureDate('2023-09-07');
    const endsAt = getFutureDate('2023-09-06');

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    startsAt.setDate(startsAt.getDate() + 1);
    endsAt.setDate(endsAt.getDate() + 3);

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })).resolves.toBeInstanceOf(Appointment);
  });

  it('should not be able to create an appointment with overlapping dates', async () => {
    const startsAt = getFutureDate('2023-09-10');
    const endsAt = getFutureDate('2023-09-15');

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    startsAt.setDate(startsAt.getDate() + 1);
    endsAt.setDate(endsAt.getDate() + 3);

    await createAppointment.execute({
      customer: 'John Doe',
      startsAt,
      endsAt
    })

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-09-14'),
      endsAt: getFutureDate('2023-09-18'),
    })).rejects.toBeInstanceOf(Error)

    expect(createAppointment.execute({
      customer: 'John Doe',
      startsAt: getFutureDate('2023-09-08'),
      endsAt: getFutureDate('2023-09-12'),
    })).rejects.toBeInstanceOf(Error)
  });
});