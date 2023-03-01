const booking = require("../Models/bookingModels")

exports.slots = async (turfOpenTime, bookings) => {
    try {
        let startTurf = turfOpenTime["open"].substring(0, 2)
        let startTurfZone = turfOpenTime["open"].substring(turfOpenTime["open"].length - 2, turfOpenTime["close"].length)
        let endTurf = turfOpenTime["close"].substring(0, 2)
        let endTurfZone = turfOpenTime["close"].substring(turfOpenTime["close"].length - 2, turfOpenTime["close"].length)
        console.log(startTurf, startTurfZone, endTurf, endTurfZone)
        //current time
        const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        let [date, newTime] = now.split(", ");
        if (newTime[0] <= 9)
            newTime = "0" + newTime

        let hour = newTime.substring(0, 2)
        let timeFrom = newTime.substring(newTime.length - 2, newTime.length)

        let timeTurf = []
        const startTime = new Date('2023-02-28T00:00:00');
        const endTime = new Date('2023-02-28T24:00:00');
        const timeSlotDuration = 60 * 59 * 1000;
        const timeSlotDuratio = 60 * 60 * 1000;
        let flage = 0;
        for (let time = startTime; time < endTime; time = new Date(time.getTime() + timeSlotDuratio)) {
            const start = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end = new Date(time.getTime() + timeSlotDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let hoursTime = start.substring(0, 2)
            let startMeridiem = start.substring(start.length - 2, start.length)
            let endTime = end.substring(0, 2)
            let endMeridiem = end.substring(end.length - 2, end.length)
            if (flage)
                timeTurf.push({ start: start, end: end, flage: false })

            if (hoursTime == hour && startMeridiem == timeFrom && startTurf == hoursTime && startTurfZone == startMeridiem) {
                flage = 1
            }
            if (endTime == endTurf && endMeridiem == endTurfZone) {
                break
            }

        }
        for (let x of bookings) {
            let flage = 0
            for (let y of timeTurf) {
                if ((y.start).replace(/\u202F/g, ' ') == x.st) {
                    flage = 1;
                }
                if (flage) {
                    y.flage = true
                }
                if ((y.end).replace(/\u202F/g, ' ') == x.et)
                    break;
            }
        }

        return timeTurf
    }
    catch (err) {
        return false
    }
}
// export default slots;