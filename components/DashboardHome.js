import { db } from '../firebase/clientApp'
import { Menu, Transition } from '@headlessui/react';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';
import { Fragment, useState, useEffect } from 'react';
import { getFirestore, getDocs, collection, query, onSnapshot, doc, querySnapshot } from 'firebase/firestore'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardHome() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  const db = getFirestore();
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const getTrips = async () => {
      const querySnapshot = await getDocs(collection(db, 'trips'));
      const trips = querySnapshot.forEach((doc) => {
        console.log(doc.data());
      })
      setTrips(trips)
    }
    getTrips();
  }, [])

  console.log(trips)

  const previousMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const getDayTrips = async () => {
    const querySnapshot = await getDocs(collection(db, 'trips'));
    let selectedDaytrips = querySnapshot.forEach((doc) => {
      isSameDay(parseISO(trip.tripStartDate), selectedDay)
    })
  }
  getDayTrips()
  // let selectedDaytrips = trips.filter((trip) =>
  //   isSameDay(parseISO(trip.tripStartDate), selectedDay)
  // );

  return (
    <div className='pt-16'>
      <div className='max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6'>
        <div className='md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'>
          <div className='md:pr-14'>
            <div className='flex items-center'>
              <h2 className='flex-auto font-semibold text-softBlack text-lg md:text-2xl'>
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type='button'
                onClick={previousMonth}
                className='-my-1.5 flex flex-none items-center justify-center p-1.5 bg-primary hover:bg-light rounded-full'
              >
                <span className='sr-only'>Previous month</span>
                <ChevronLeftIcon
                  className='w-5 h-5 text-softBlack'
                  aria-hidden='true'
                />
              </button>
              <button
                onClick={nextMonth}
                type='button'
                className='-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 bg-primary hover:bg-light rounded-full'
              >
                <span className='sr-only'>Next month</span>
                <ChevronRightIcon
                  className='w-5 h-5 text-softBlack'
                  aria-hidden='true'
                />
              </button>
            </div>
            <div className='grid grid-cols-7 mt-10 text-sm md:text-lg leading-6 text-center text-primary font-bold'>
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className='grid grid-cols-7 mt-2 text-sm md:text-lg'>
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'py-1.5'
                  )}
                >
                  <button
                    type='button'
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && 'text-white',
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'text-primary',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-softBlack',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-softBlack',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-primary',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-primary',
                      !isEqual(day, selectedDay) && 'hover:bg-light',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className='w-1 h-1 mx-auto mt-1'>
                    {trips.some((trip) =>
                      isSameDay(parseISO(trip.tripStartDate), day)
                    ) && (
                      <div className='w-2 h-2 rounded-full bg-primary'></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
              <button className='button mt-6'>Add Trip</button>
          </div>
          <section className='mt-12 md:mt-0 md:pl-14'>
            <h2 className='font-semibold text-softBlack text-lg md:text-2xl'>
              Itinerary for{' '}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMM dd, yyy')}
              </time>
            </h2>
            <ol className='mt-4 space-y-1 text-sm md:text-base leading-6 text-softBlack'>
              {selectedDaytrips.length > 0 ? (
                selectedDaytrips.map((trip) => (
                  <Trip trip={trip} key={trip.id} />
                ))
              ) : (
                <p>No trips scheduled. What are you waiting for?</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function Trip({ trip }) {
  let startDate = parseISO(trip.tripStartDate);
  let endDateTime = parseISO(trip.tripEndDate);

  return (
    <li className='flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100'>
      <div className='flex-auto'>
        <p className='text-gray-900'>{trip.tripName}</p>
        {/* <p className='mt-0.5'>
          <time dateTime={trip.tripStartDate}>
            {format(startDate, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={trip.tripEndDate}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p> */}
      </div>
      <Menu
        as='div'
        className='relative opacity-0 focus-within:opacity-100 group-hover:opacity-100'
      >
        <div>
          <Menu.Button className='-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600'>
            <span className='sr-only'>Open options</span>
            <EllipsisHorizontalIcon className='w-6 h-6' aria-hidden='true' />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='py-1'>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='#'
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href='#'
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
