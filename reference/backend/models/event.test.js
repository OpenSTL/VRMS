const { setupDB } = require('../setup-test');
setupDB("event-model");

const { Event } = require('./event.model');

describe('CREATE', () => {
  test('Can create a complex Event', async (done) => {
    const submittedData = {
      name: 'eventName',
      location: {
        // should we include address here?
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
      },
      hacknight: 'Online', // DTLA, Westside, South LA, Online
      eventType: 'Workshop', // Project Meeting, Orientation, Workshop
      description: 'A workshop to do stuff',
      date: 1594023390039,
      startTime: 1594023390039, // start date and time of the event
      endTime: 1594023390039, // end date and time of the event
      hours: 2, // length of the event in hours
      createdDate: 1594023390039, // date/time event was created
      updatedDate: 1594023390039, // date/time event was last updated
      checkInReady: false, // is the event open for check-ins?
      owner: {
        ownerId: 33, // id of user who created event
      },
    };

    await Event.create(submittedData);
    const savedDataArray = await Event.find();
    const savedData = savedDataArray[0];
    expect(savedData.name).toBe( submittedData.name);
    expect(savedData.location.city).toBe(submittedData.location.city);
    expect(savedData.startTime.getTime()).toBe(submittedData.startTime);
    done();
  });

  test('Can create a simple Event', async (done) => {
    const submittedData = { name: 'testEvent' };
    await Event.create(submittedData);
    const savedDataArray = await Event.find();
    const savedData = savedDataArray[0];
    expect(savedData.name).toBe('testEvent');
    done();
  });
});

describe('Cannot save simple data', () => {});
