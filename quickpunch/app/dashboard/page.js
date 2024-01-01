"use client";

import { redirect } from 'next/navigation';
// import { Avatar } from '@nextui-org/react';
import Image from 'next/image';
import { Tabs, Tab } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Spinner, Button } from "@nextui-org/react";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import CountUp from 'react-countup';

export default function App() {
  const [selected, setSelected] = useState("details");
  const [preference, setPreference] = useState([]);
  const [selectedPref, setSelectedPref] = useState(preference);
  let [loadSessionState, setLoadSessionState] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [creds, setCreds] = useState('');
  const [days, setDays] = useState(0);
  const [articles, setArticles] = useState(0);

  let session_details = useRef(null);
  let logged_in = null;

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        session_details.current = JSON.parse(window.localStorage.getItem('supabaseSession'));
        if (!session_details.current) {
          logged_in = false;
        }
        logged_in = true;
      }

      if (!logged_in) {
        redirect('/');
      }

      try {
        const preference_list = await fetch('/api/getPreferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: session_details.current.user.email })
        });

        const difference_ms = new Date() - new Date(session_details.current.user.confirmed_at);

        const data = await preference_list.json();
        setLoadSessionState(true);
        setPreference(data);
        setSelectedPref(data);

        const n_reads = await fetch('/api/getArticles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: session_details.current.user.email, preferences: data })
        });

        setArticles(await n_reads.json());
        setDays(Math.ceil(difference_ms / (1000 * 60 * 60 * 24)));
        setCreds(session_details.current.user.email);

      } catch (error) {
        console.error('Error during API call:', error);
      }
    };
    fetchData();
  }, []);

  const handleChangePreferences = async (onClose) => {
    setPreference(selectedPref);
    if (typeof window !== 'undefined' && window.localStorage) {
      session_details.current = JSON.parse(window.localStorage.getItem('supabaseSession'));
      const response = await fetch('/api/updatePreferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: session_details.current.user.email, preferences: selectedPref })
      });
      const data = await response.json();
      onClose();
    }
  }
  return (
    <div style={{ background: "url(/backgroundv5.jpg)", backgroundSize: "cover" }} className='min-h-screen min-w-screen'>
      <div className='min-h-fit flex flex-col justify-start items-center backdrop-blur-md'>
        <div className="flex flex-col justify-end items-center">
          <div className='w-screen bg-gradient-to-tr from-pink-500 to-yellow-500 h-40'></div>
          <div style={{ position: "absolute", zIndex: "10" }}>
            {/* <Avatar
              size='lg'
              className='w-32 h-32'
              radius='lg'
            /> */}
            <Image
              src='/quickpunch.jpeg'
              alt='QuickPunch'
              width={192}
              height={192}
              className='rounded-full'
            />

          </div>
          <div className='min-w-screen h-12'></div>
        </div>
      </div>
      <div className='min-h-fit flex pb-8 p-10 text-xl flex-wrap justify-center items-center backdrop-blur-xl'>
        <p> 👋🏾 <b>{creds}</b> </p>
      </div>
      <div className="flex flex-col justify-center items-center backdrop-blur-md">
        <div style={{ maxWidth: "50%" }} className='p-5 rounded-xl flex flex-col justify-center items-center'>
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={setSelected}
            variant='solid'
            size='lg'
            color='danger'
          >
            <Tab key="Details" title="About Me">
              <div className="gap-8 xs:gap-4 mt-10 md:gap-8 lg:gap-16 grid grid-cols-12 grid-rows-2">
                <Card isFooterBlurred className="col-span-12 flex bg-white/15 flex-col item-center">
                  <CardHeader className="flex-col">
                    <h4 className="text-tiny text-white/80 uppercase font-bold">Your Preferences</h4>
                  </CardHeader>
                  <CardBody className='items-center justify-center'>
                    {loadSessionState ? (
                      <p className="text-white items-center justify-center font-medium flex flex-wrap text-large">
                        {preference.map((item, index) => (
                          <span key={index} className='border-2 p-2 m-1 rounded-lg transform transition-transform hover:scale-110'>{item.charAt(0).toUpperCase() + item.slice(1)} </span>
                        ))}
                      </p>
                    ) : (
                      <Spinner label="Loading..." color="danger" />
                    )}
                  </CardBody>
                  <CardFooter color='primary' radius='lg' variant='flat'>
                    <Button onClick={() => setSelected("preferences")} className="text-tiny text-white" variant="bordered" color="default" radius="lg" size="sm">
                      Change Preferences
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="col-span-6 flex-col transform bg-white/20 transition-transform hover:scale-110 flex items-center justify-center">
                  <CardHeader className="flex-col">
                    <p className="text-tiny text-white/80 uppercase font-bold">Member for</p>
                  </CardHeader>
                  <CardBody className='items-center justify-center'>
                    {loadSessionState ? (
                      <h4 className="text-white font-medium text-large"><span className="text-6xl"><CountUp end={days} /></span></h4>
                    ) : (
                      <Spinner color="danger" />
                    )}
                  </CardBody>
                  <CardFooter className="flex-col">
                    <p className="text-tiny text-white/80 uppercase font-bold">days</p>
                  </CardFooter>
                </Card>
                <Card shadow="xl" className="col-span-6 transform bg-white/20 transition-transform hover:scale-110">
                  <CardHeader className="flex-col">
                    <p className="text-tiny text-white/80 uppercase font-bold">You have read</p>
                  </CardHeader>
                  <CardBody className='items-center justify-center'>
                    {loadSessionState ? (
                      <h4 className="text-white font-medium text-large"><span className="text-6xl"><CountUp end={articles} /></span></h4>
                    ) : (
                      <Spinner color="danger" />
                    )}
                  </CardBody>
                  <CardFooter className="flex-col">
                    <p className="text-tiny text-white/80 uppercase font-bold">articles</p>
                  </CardFooter>
                </Card>
              </div>
            </Tab>
            <Tab key="preferences" title="Preferences">
              <Card className='m-10 bg-white/20'>
                <CardBody>
                  <div className="flex flex-col">
                    <CheckboxGroup
                      value={selectedPref}
                      onValueChange={setSelectedPref}
                      defaultChecked={preference}
                    >
                      <Checkbox name="auto" value="auto" color="danger" className='p-4'>
                        Auto
                      </Checkbox>
                      <Checkbox name="business" value="business" color="danger" className='p-4'>
                        Business
                      </Checkbox>
                      <Checkbox name="economics" value="economics" color="danger" className='p-4'>
                        Economics
                      </Checkbox>
                      <Checkbox name="finances" value="finances" color="danger" className='p-4'>
                        Finances
                      </Checkbox>
                      <Checkbox name="lifestyle" value="lifestyle" color="danger" className='p-4'>
                        Lifestyle
                      </Checkbox>
                      <Checkbox name="management" value="management" color="danger" className='p-4'>
                        Management
                      </Checkbox>
                      <Checkbox name="opinions" value="opinions" color="danger" className='p-4'>
                        Opinions
                      </Checkbox>
                      <Checkbox name="politics" value="politics" color="danger" className='p-4'>
                        Politics
                      </Checkbox>
                      <Checkbox name="realty" value="realty" color="danger" className='p-4'>
                        Realty
                      </Checkbox>
                      <Checkbox name="technology" value="technology" color="danger" className='p-4'>
                        Technology
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button onPress={onOpen}>Save Changes</Button>
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1 text-white">Confirm edits</ModalHeader>
                          <ModalBody>
                            <p className='text-white'>Are you sure you want to save these changes?</p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                              Close
                            </Button>
                            <Button variant="solid" color="default" onPress={() => handleChangePreferences(onClose)}>
                              Confirm
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </CardFooter>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
