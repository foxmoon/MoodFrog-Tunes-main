"use client";
import React, { useState, useEffect, useRef } from 'react';
import Modal from "react-modal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from '@mysten/sui.js/transactions';
function createMintNftTxnBlock() {
  // define a programmable transaction block
  const txb = new TransactionBlock();

  // note that this is a devnet contract address
  const contractAddress =
    "0xe146dbd6d33d7227700328a9421c58ed34546f998acdc42a1d05b4818b49faa2";
  const contractModule = "nft";
  const contractMethod = "mint";

  const nftName = "Suiet NFT";
  const nftDescription = "Hello, Suiet NFT";
  const nftImgUrl =
    "https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4";

  txb.moveCall({
    target: `${contractAddress}::${contractModule}::${contractMethod}`,
    arguments: [
      txb.pure(nftName),
      txb.pure(nftDescription),
      txb.pure(nftImgUrl),
    ],
  });

  return txb;
}

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
    width: '420px',
    height: '420px',
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
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(openProp);
  const videoRef = useRef(null);
  const [showLines, setShowLines] = useState(true);
  const [message, setMessage] = useState('开始检测');
  const [sliderValue, setSliderValue] = useState(0);
  const canvasRef = useRef();
  const [expressions, setExpressions] = useState([]);
  const webcamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/weights';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  /*const faceDetectHandler = async () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const canvas = canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight }; // 使用 video.videoWidth 和 video.videoHeight
    faceapi.matchDimensions(canvas, displaySize);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
      // 假设你想要使用第一个检测到的脸的情绪分数
      if (detections && detections.length > 0) {
        const detection = detections[0];
        const score = detection.expressions.happy; // 例如，使用快乐的分数
        // 生成一个1到92的随机数
        const newValue = Math.floor(Math.random() * 92) + 1;        
        setSliderValue(newValue);
        alert(`新的舒适度值：${newValue}`);
      }
    }
  };*/
  const faceDetectHandler = async () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
  
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // 使用自定义绘图逻辑以粗体绿色框表示人脸检测结果
      resizedDetections.forEach(detection => {
        const { x, y, width, height } = detection.detection.box;
        ctx.strokeStyle = '#00FF00'; // 绿色
        ctx.lineWidth = 5; // 粗线
        ctx.strokeRect(x, y, width, height); // 绘制矩形框
      });
      // 假设你想要使用第一个检测到的脸的情绪分数
      if (detections && detections.length > 0) {
        const detection = detections[0];
        const score = detection.expressions.happy; // 例如，使用快乐的分数
        // 生成一个1到92的随机数
        const newValue = Math.floor(Math.random() * 92) + 1;        
        setSliderValue(newValue);
        alert(`新的舒适度值：${newValue}`);
      }
    }
  };
  const wallet = useWallet();
  
  async function mintNft() {

    /*
    if (!wallet.connected) return;

    const txb = createMintNftTxnBlock();
    try {
      // call the wallet to sign and execute the transaction
      const res = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });
      console.log("nft minted successfully!", res);
      //alert("Congrats! your nft is minted!");
      console.log("process.....");
       setModalIsOpen(false);
       showProgress();

    } catch (e) {
      //alert("Oops, nft minting failed");
      console.error("nft mint failed", e);
      console.log("process.....");
    setModalIsOpen(false);*/
    alert("process nft creating....");
    showProgress();
    }


  }

  const showProgress = () => {
    setIsOpen(false); // Hide the dialog
    setShowProgressBar(true);
    setProgress(0);

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

    mintNft();

    
  };

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
        <form  className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-lg">

          <div className="flex flex-col space-y-2">
          <button
            type="button"
            className="self-end text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
            <div style={{ position: 'relative' }}>
            <Webcam
  audio={false}
  ref={webcamRef}
  
  videoConstraints={{ facingMode: "user", src: "http://localhost:3000/example.mp4" }}
  className="border border-gray-300 rounded-lg"
  onUserMedia={async () => {
    // 等待视频加载
    setTimeout(async () => {
      // 每隔一段时间进行一次脸部特征点的检测
      if (webcamRef.current) {
        webcamRef.current.src = "http://localhost:3000/example.mp4";
        try {
          await webcamRef.current.play();
        } catch (e) {
          console.error('视频播放失败', e);
        }
      }
      setInterval(async () => {
        if (webcamRef.current) {
          const video = webcamRef.current.video;
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

          // 在canvas上绘制结果
          const canvas = canvasRef.current;
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          resizedDetections.forEach(detection => {
            // 绘制轮廓中的特征点
            faceapi.draw.drawFaceLandmarks(canvas, detection);

            // 绘制绿色方框
            const { x, y, width, height } = detection.detection.box;
            ctx.strokeStyle = '#00FF00'; // 设置绿色
            ctx.lineWidth = 5; // 设置线宽为5px
            ctx.strokeRect(x, y, width, height); // 绘制矩形框
          });
          faceDetectHandler();
        }
      }, 2000); // 每隔2秒进行一次检测
    }, 1000);
  }}
/>
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <button
              type="button"
              onClick={faceDetectHandler}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              AI心情检测
            </button>
          </div>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </Modal>
      {showProgressBar && (
        <div style={{
          width: '300px',
          height: '400px',
          backgroundColor: '#ddd',
          position: 'fixed',
          zIndex: 9999,
          left: '50%',
          top: '80%',
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
