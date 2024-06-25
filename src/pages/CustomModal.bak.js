"use client";
import React, { useState, useEffect,useRef } from 'react';
import Modal from "react-modal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled, { keyframes, css } from 'styled-components';

/*const moveLines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 20px;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      rgba(0, 0, 255, 0.5),
      rgba(0, 128, 0, 0.5) 3px,
      transparent 3px,
      transparent 20px
    );
    animation: ${moveLines} 2s linear infinite;
  }
`;
*/

const moveLines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 40px;
  }
`;
const VideoWrapper = styled.div`
  position: relative;
  overflow: hidden;

  ${({ showLines }) => showLines && css`
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      180deg,
      rgba(0, 0, 255, 0.5),
      rgba(0, 128, 0, 0.5) 3px,
      transparent 3px,
      transparent 20px
    );
    animation: ${moveLines} 2s linear infinite;
  }
  `}
`;
/*
const VideoWrapper = styled.div`
  position: relative;
  overflow: hidden;

  ${({ showLines }) => showLines && css`
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        180deg,
        rgba(0, 128, 0, 0.5) 3px,
        transparent 3px,
        transparent 10px
      );
      animation: ${moveLines} 1s linear infinite;
    }
  `}
`;
*/
const Message = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  text-align: center;
`;


Modal.setAppElement("#__next");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '320px', 
    height: '60%',
    backgroundColor: 'white',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  
};

export default function CustomDialog({ open: openProp, onClose }) {
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
 // const [message, setMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(openProp);
  const videoRef = useRef(null);
  const [showLines, setShowLines] = React.useState(true);
  const [message, setMessage] = useState('开始检测');
  const [sliderValue, setSliderValue] = useState(0);

  /*useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    setShowLines(true);

    getVideo();
    const timer = setTimeout(() => {
      setShowLines(false);
      setMessage('检测结束');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 3000);
    }, (Math.random() * 6 + 3) * 1000);

    return () => clearTimeout(timer);
  }, []);*/
  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    setMessage('开始检测');
    /*
    setShowLines(true);
    getVideo();*/
    setTimeout(() => {
      setShowLines(true);
      getVideo();
    }, 0);
  
    setTimeout(() => {
      setMessage('');
     
    }, 2000);  // 修改这里，从1秒改为2秒
  
    const timer = setTimeout(() => {
      //setShowLines(false);
      setMessage('检测结束');
      setTimeout(() => {
        setMessage('');
        const comfortLevel = Math.floor(Math.random() * 80) + 1;
        alert(`检测到舒适度为 ${comfortLevel}`);
        handleComfortChange(comfortLevel);
        //onClose();
      }, 2000);  // 修改这里，从1秒改为2秒
    }, (Math.random() * 6 + 8) * 1000);
  
    return () => clearTimeout(timer);
  }, []);
/*
  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    setShowLines(true);

    getVideo();
    const timer = setTimeout(() => {
      setShowLines(false);
      const comfortLevel = Math.floor(Math.random() * 10) + 1;
      alert(`检测到舒适度为 ${comfortLevel}`);
    }, (Math.random() * 16 + 2) * 1000);

    return () => clearTimeout(timer);
  }, []);*/


  /*useEffect(() => {
    let timer;
    if (showProgressBar && progress < 100) {
      timer = setTimeout(() => {
        setProgress(progress + 1);
      }, 20);
    } else if (progress >= 100) {
      setMessage('生成完毕');
      timer = setTimeout(() => {
        setShowProgressBar(false);
        setMessage('');
        onClose(); // 调用onClose回调函数关闭当前对话框
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [progress, showProgressBar, onClose]);
 */
/*
  useEffect(() => {
    let timer;
    if (!isOpen && progress < 100) {
      timer = setTimeout(() => {
        setProgress(progress + 1); // 更新进度条
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [isOpen, progress]);*/

  const showProgress = () => {
    setIsOpen(false); // Hide the dialog
    setShowProgressBar(true);
    setProgress(0);
  
    let timer;
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          setMessage('生成完毕');
          window.postMessage("生成完毕", "*");

          setTimeout(() => {
            setShowProgressBar(false);
            setMessage('');
            onClose(); // Call the onClose callback function to close the dialog

          }, 3000);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);
  
    return () => clearInterval(progressInterval);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmed = window.confirm('是否开始AI生成音乐？');
    if (!confirmed) {
      return;
    }
    console.log("process.....");
    setModalIsOpen(false);
    showProgress();
  };
  
  /*const showProgress = () => {
    setIsOpen(false); // 隐藏对话框
    setShowProgressBar(true);
    setProgress(0);
    onClose(); // 调用onClose回调函数关闭当前对话框
  };*/
  /*
  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmed = window.confirm('是否开始AI生成音乐？');
    if (!confirmed) {
      return;
    }
    console.log("process.....");
    setModalIsOpen(false);
    showProgress();
    onClose(); // 调用onClose回调函数关闭当前对话框
  };

  const showProgress = () => {
    setIsOpen(false); // 隐藏对话框
    setShowProgressBar(true);
    setProgress(0);
  };
*/
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleComfortChange = (newValue) => {
    console.log('Slider value changed:', newValue);
    setSliderValue(newValue);

  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel="Custom Dialog"
      >
     
        <form onSubmit={handleSubmit} className="space-y-4">
        <button
    className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 focus:outline-none"
    onClick={onClose}
  >
    Close
  </button>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Comfort:</label>
            <Slider
  min={0}
  max={100}
  value={sliderValue}
  onChange={handleComfortChange}
  className="mt-1"
/>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Notes:</label>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p>{message}</p>

          <VideoWrapper showLines={showLines}>
      <video ref={videoRef} autoPlay />
      <Message>{message}</Message>
    </VideoWrapper>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </Modal>
      {showProgressBar && (
  <div style={{
    width: '300px',
    backgroundColor: '#ddd',
    position: 'fixed',
    zIndex: 9999,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }}>
    <div style={{ width: `${progress}%`, backgroundColor: 'blue', height: '20px' }} />
    <p style={{ position: 'absolute', width: '100%', textAlign: 'center', color: 'white' }}>
      AI定制音乐生成中.....
    </p>
  </div>
)}
      {message && (
        <div style={{ color: 'green', textAlign: 'center' }}>{message}</div>
      )}
    </>
  );
}