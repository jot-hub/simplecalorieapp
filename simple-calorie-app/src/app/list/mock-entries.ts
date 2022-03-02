import { Entry } from "../../../../model/entry";
import { compareAsc, format, parse } from 'date-fns';


let ENTRIES: Entry[] = [
    {
        date: "2014-11-01",
        details:[
            {timeOfDay: "20:00", name: 'bananas', calories: 1000},
            {timeOfDay: "11:00", name: 'bananas', calories: 1000},
            {timeOfDay: "09:00", name: 'bananas', calories: 1000}
        ]
    },
    {
        date: "2014-12-01",
        details:[
            {timeOfDay: "08:00", name: 'bananas', calories: 1000},
            {timeOfDay: "06:00", name: 'bananas', calories: 1000}
        ]
    },
    {
        date: "2014-12-01",
        details:[
            {timeOfDay: "05:00", name: 'bananas', calories: 1000},
            {timeOfDay: "11:00", name: 'bananas', calories: 999}
        ]
    }
  ];

ENTRIES.sort((entry1,entry2) => compareAsc(parse(entry1.date,'yyyyMMdd', new Date()),parse(entry2.date,'yyyyMMdd', new Date())));

export { ENTRIES };