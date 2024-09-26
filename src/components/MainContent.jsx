import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PrayerCards from "./Prayers";
import elfagr from "../imgs/elfagr.jpg";
import elzohr from "../imgs/elzohr.jpg";
import elasr from "../imgs/elasr.jpg";
import elmagrib from "../imgs/elmagrib.jpg";
import elesha from "../imgs/elesha.jpg";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment/dist/locale/ar-dz"; // Import Arabic locale

export default function MainContent() {
  /* States */
  /* State for timings */
  const [timings, setTimings] = useState({
    Fajr: "05:18",
    Dhuhr: "12:46",
    Asr: "16:13",
    Maghrib: "18:47",
    Isha: "20:04",
  });
  /* State for city name */
  const [cityName, setCityName] = useState({
    displayName: "القاهرة",
    apiName: "cairo",
  });
  /* Array For Avilable Cities  */
  const avilableCities = [
    {
      displayName: "القاهرة",
      apiName: "cairo",
    },
    {
      displayName: "الاسكندرية",
      apiName: "Alexandria",
    },
    {
      displayName: "طنطا",
      apiName: "tanta",
    },
  ];
  /* State for date */
  const [today, setToday] = useState("");
  /* State for Timer */
  const [remainingTime, setRemainingTime] = useState("");
  /* useEffect for get timings */
  useEffect(() => {
    const getTimings = async () => {
      const prayers = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=EGY&city=${cityName.apiName} `
      );
      setTimings(prayers.data.data.timings);
    };
    getTimings();
  }, [cityName]);
  /* State for city name in timer section */
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const avilablePrayers = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الضهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  /* useEffect for Timer and date*/
  useEffect(() => {
    let timerInterval = setInterval(() => {
      setupCountDownTimer();
    }, 1000);
    const t = moment();
    setToday(t.format("DD MMM YYYY | hh:mm"));
    return () => {
      clearInterval(timerInterval);
    };
  }, [timings]);
  /* function to handel Timer */
  const setupCountDownTimer = () => {
    const momentNow = moment();
    let prayerIndex = 2;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    setNextPrayerIndex(prayerIndex);
    //Now we can setup the count down timer
    const nextPryerObject = avilablePrayers[prayerIndex];
    const nextPrayerTime = timings[nextPryerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTimeMoment).diff(momentNow);

    //if next prayer is elfajr
    if (remainingTime < 0) {
      const fromNowToMidnight = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fromMidnightToFajr = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      console.log(moment.duration(fromNowToMidnight));
      console.log(moment.duration(fromMidnightToFajr));
      const totalDifferance = fromNowToMidnight + fromMidnightToFajr;
      remainingTime = totalDifferance;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`
    );
  };
  /* function to handel city change */
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    setCityName(cityObject);
  };
  return (
    <>
      {/* Start Header Row */}
      <Grid container>
        <Grid size={6}>
          <div>
            <h2>{today}</h2>
            <h1>{cityName.displayName}</h1>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h2>
              متبقى حتى صلاة {avilablePrayers[nextPrayerIndex].displayName}
            </h2>
            <h1>{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/* End Header Row */}

      {/* Start Divider */}
      <Divider
        variant="middle"
        style={{ borderColor: "white", opacity: "0.1" }}
      />
      {/* End Divider */}
      {/* Start Cards */}
      <Stack
        direction={"row"}
        style={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: "30px",
        }}>
        <PrayerCards name="الفجر" time={timings.Fajr} image={elfagr} />
        <PrayerCards name="الظهر" time={timings.Dhuhr} image={elzohr} />
        <PrayerCards name="العصر" time={timings.Asr} image={elasr} />
        <PrayerCards name="المغرب" time={timings.Maghrib} image={elmagrib} />
        <PrayerCards name="العشاء" time={timings.Isha} image={elesha} />
      </Stack>
      {/* End Cards */}

      {/* Start Select */}
      <Stack
        direction={"row"}
        justifyContent={"center"}
        style={{
          marginTop: "40px",
        }}>
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white", fontSize: "20px" }}>المدينة</span>
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={cityName.apiName}
            onChange={handleCityChange}
            sx={{
              borderRadius: "8px",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}>
            {avilableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>

      {/* End Select */}
    </>
  );
}
