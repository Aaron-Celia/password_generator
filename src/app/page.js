'use client';
import axios from "axios";
import { Alert, Button, Container, Slider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState('password');
  const [desiredLength, setDesiredLength] = useState(12);
  const [generated, setGenerated] = useState(false);
  const [errorMsg, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const increasePageVisitCount = async () => {
    await axios.get('https://api.api-ninjas.com/v1/counter?id=page_visits&hit=true', {
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_API_NINJAS_API_KEY,
        'Content-Type': "application/json"
      }
    })
    .then(res => {
      console.log(res.data.value);
    })
    .catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
      increasePageVisitCount();
  }, []);

  let copiedTimeout = 3000; // milliseconds to show alert that they copied the message
  let generatedTimeout = 3000; // milliseconds to show different button

  const generate = () => {
    const specialChars = '!@#$%^&*()';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '1234567890';

    
    const getRandom = (string) => {
      const randNum = Math.floor(Math.random() * string.length);
      return string[randNum]
    };
    
    let password = [];
    
    const charArrAll = [specialChars, alphabet, nums];

    while(password.length < desiredLength) {
      // generate random number between 0 and 2 (2 inclusive)
      let i = Math.floor(Math.random() * charArrAll.length);
      // pick one of the three strings
      let str = charArrAll[i];
      // get random character from that string based on it's length
      let randomChar = getRandom(str);
      console.log(randomChar);
      // push it to password array
      password.push(randomChar)
    }

    let result = password.join('');
    
    if(result.length === desiredLength) {
      setGenerated(true);
      setPassword(result);
      setTimeout(() => {
        setGenerated(false)
      }, generatedTimeout)
    } else {
      setPassword('');
      setErrorMessage('Something went wrong.');
    }
  }


  let centerSx = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%'
  }


  return (
    <Container className='h-screen text-center' sx={centerSx}>
      <Typography id="title" className='my-10' variant='h4'>Password-Generating Algorithm</Typography>
      <Stack sx={centerSx}>
        <Typography>Password Length</Typography>
        <Typography>{desiredLength}</Typography>
        <Slider value={desiredLength} onChange={(e) => setDesiredLength(e.target.value)} min={8} max={20} />
      </Stack>
      <Stack sx={centerSx}>
        <code className="my-10 bg-green-800 p-5 rounded-xl">
          <>{password.length ? password : errorMsg}</>
        </code>
        <Button id="button1" variant="outlined" className="my-10" color={generated ? "success" : "primary"} onClick={() => generate()}>Generate</Button>
        <Button id="button2" variant="outlined" className="my-10" color={copied ? "success" : "primary"} onClick={() => {
          try{
            window.navigator.clipboard.writeText(`${password}`);
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, copiedTimeout);
          } catch(err) {
            setErrorMessage(err);
          }
        }}>Copy Password</Button>
        {generated &&
          <Alert className='my-5' severity={generated ? 'success' : 'error'}>{generated ? 'Password Generated!' : errorMsg}</Alert>
        }
        {errorMsg &&
          <Alert className='my-5' severity="error">{errorMsg}</Alert>
        }
        {copied &&
          <Alert className='my-5' severity="success">Copied!</Alert>
        }
      </Stack>
    </Container>
  )
}