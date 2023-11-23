const booking = require("../Models/bookingModels");
const Turf = require("../Models/turfModels");

slots = async () => {
  try {
    let timeTurf = [];

    const startTime = new Date("2023-02-28T00:00:00");
    const endTime = new Date("2023-02-28T24:00:00");
    const timeSlotDuration = 60 * 59 * 1000;
    const timeSlotDuratio = 60 * 60 * 1000;
    let flageDay = 0,
      falgeTime = 0;
    for (
      let time = startTime;
      time < endTime;
      time = new Date(time.getTime() + timeSlotDuratio)
    ) {
      const start = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const end = new Date(
        time.getTime() + timeSlotDuration
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      timeTurf.push({
        start: start,
        end: end,
        flage: false,
      });
    }
    return timeTurf;
  } catch (err) {
    return false;
  }
};

exports.bookingValidation = async (
  availableTime,
  currentdate,
  day,
  playgroundDetails,
  turf_id,
  validateSlots
) => {
  try {
    let turfPrice = 0;
    let play_ground_name = "";
    let slotsTime = await slots();
    let timeTurf;
    // const desiredDate = new Date(date);
    console.log("ghjkkl",slotsTime)
    for (let playground_id of playgroundDetails) {
      const turfDeatails = await Turf.findOne(
        {
          _id: turf_id,
          playground_list: {
            $elemMatch: {
              _id: playground_id,
            },
          },
        },
        {
          "playground_list.$": 1,
          available: 1,
        }
      );
      timeTurf = turfDeatails.available[day];
      if (!turfDeatails) {
        return false
      }
      let bookings = await booking.find(
        {
          playground_id: playground_id,
          booking_date: currentdate,
        },
        {
          startTime: 1,
          endTime: 1,
          _id: 0,
        }
      );
      console.log(bookings,"bookings")

      turfPrice += Number(turfDeatails.playground_list[0].price[day]);
      play_ground_name =
        play_ground_name + " " + turfDeatails.playground_list[0].name;
      for (let x of bookings) {
        let flage = 0;     
        for (let y of slotsTime) {
          if ((y.start).replace(/\u202F/g, ' ') == (x.startTime).replace(/\u202F/g, ' ') ) {
            flage = 1;
          }
          if (flage) {
            y.flage = true;
          }
          if ((y.end).replace(/\u202F/g, ' ') == (x.endTime).replace(/\u202F/g, ' ') ) break;
        }
      }
      console.log(slotsTime)
      if (validateSlots) {
        for (let x of validateSlots) {
          for (let y of slotsTime) {
            if ((y.start).replace(/\u202F/g, ' ') == (x.start).replace(/\u202F/g, ' ') && y.flage == true) {
              return false;
            }
          }
        }
      }
    }
    let turfOpenTime = timeTurf;
    let startTurf = turfOpenTime["open"].substring(0, 2);
    let startTurfZone = turfOpenTime["open"].substring(
      turfOpenTime["open"].length - 2,
      turfOpenTime["close"].length
    );
    let endTurf = turfOpenTime["close"].substring(0, 2);
    let endTurfZone = turfOpenTime["close"].substring(
      turfOpenTime["close"].length - 2,
      turfOpenTime["close"].length
    );

    //current time
    const now = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    let [date, newTime] = now.split(", ");
    // newTime="12:03:24 AM"
    let hour = newTime.substring(0, 2);
    if (parseInt(hour) <= 9) newTime = "0" + newTime;
    hour = newTime.substring(0, 2);

    let timeFrom = newTime.substring(newTime.length - 2, newTime.length);
    let flageDay = 0,
      falgeTime = 0;
    for (let data of slotsTime) {
      let hoursTime = data.start.substring(0, 2);
      let startMeridiem = data.start.substring(
        data.start.length - 2,
        data.start.length
      );
      let endTime = data.end.substring(0, 2);
      let endMeridiem = data.end.substring(
        data.end.length - 2,
        data.end.length
      );
      if (
        parseInt(startTurf) == parseInt(hoursTime) &&
        startTurfZone == startMeridiem
      ) {
        flageDay = 1;
      }
      if (flageDay && falgeTime) {
        availableTime.push(data);
      }
      if (parseInt(hoursTime) == parseInt(hour) && timeFrom == startMeridiem) {
        falgeTime = 1;
      }
      if (
        parseInt(endTime) == parseInt(endTurf) &&
        endMeridiem == endTurfZone
      ) {
        break;
      }
    }
    return true;
  } catch (err) {
    console.log(err)
    return err;
  }
};
