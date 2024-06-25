import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import './styles/App.css';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
//import { ConnectWallet, useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";
import { ConnectWallet, useAddress, useContract, useTokenBalance, useSDK, ThirdwebProvider } from "@thirdweb-dev/react";

//import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ConnectButton } from '@suiet/wallet-kit';
import CustomModal from './CustomModal'; // 请确保这个路径正确
import confetti from 'canvas-confetti';

// 音乐播放器类
class MusicPlayer {
  constructor() {
    if (MusicPlayer.instance) {
      return MusicPlayer.instance;
    }
    if (typeof window !== "undefined") {
      this.audio = new window.Audio();
    } else {
      this.audio = null;
    }
    MusicPlayer.instance = this;
  }

  play(song) {
    if (this.audio) {
      if (this.audio.src !== song.src) {
        this.audio.src = song.src;
        this.audio.load();
      }
      this.audio.play();
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  setLoop(loop) {
    if (this.audio) {
      this.audio.loop = loop;
    }
  }
}

const musicPlayer = new MusicPlayer();

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playPermission, setPlayPermission] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const address = useAddress();
  const sdk = useSDK();
  const [isSigned, setIsSigned] = useState(false);

  const contractAddress = "0xaCb54d07cA167934F57F829BeE2cC665e1A5ebEF";
  const { contract } = useContract(contractAddress);
  const { data: tokenBalance } = useTokenBalance(contract, address);

  function showNFTInfo(element) {
    console.log("Mouse over", element);
  }

  function hideNFTInfo(element) {
    console.log("Mouse out", element);
  }
  function showMessage(text) {
    $('#message .message-text').text(text);
    $('#message').removeClass('hidden');
  }
  function hideMessage() {
    $('#message').addClass('hidden');
  }


  function updatePlaylists(add_completePlaylist, completePlaylist) {
    // 检查add_completePlaylist是否有歌曲
    if (add_completePlaylist.length > 0) {
      // 随机挑选一首歌的索引
      const songIndex = Math.floor(Math.random() * add_completePlaylist.length);
      // 获取这首歌
      const song = add_completePlaylist[songIndex];
      // 将这首歌添加到completePlaylist
      completePlaylist.push(song);
      // 从add_completePlaylist中删除这首歌
      add_completePlaylist.splice(songIndex, 1);
    } else {
      console.log("add_completePlaylist中没有歌曲");
    }
  }

  const completePlaylist = [
    { title: 'Starry Fantasy', artist: 'Artist 1', src: 'https://r2.erweima.ai/suno/7f30780a-1831-47c1-8bdd-fe3620bc21ab.mp3' },
     ];

  const add_completePlaylist = [
    { title: 'Moonlit Melody', artist: 'Artist 2', src: 'https://r2.erweima.ai/suno/7e889a2a-cedc-41dc-9dbd-bc648331132b.mp3' },
    { title: 'Moonlit Melody 2', artist: 'Artist 3', src: 'https://r2.erweima.ai/suno/d87de23c-f4df-4ce8-b60d-9316bcae1e87.mp3' },
    { title: 'Starry Fantasy 2', artist: 'Artist 4', src: 'https://r2.erweima.ai/suno/429a08f6-a0b4-44bd-bbd0-989c8a82fce8.mp3' },
    { title: 'Ocean\'s Serenade', artist: 'Artist 5', src: 'https://r2.erweima.ai/suno/4a0b4d68-3a15-4892-949a-0680004431ee.mp3' },
    { title: 'Forest Reverie', artist: 'Artist 6', src: 'https://r2.erweima.ai/suno/b138c9c6-8e26-4c7e-b38d-b08da784a31c.mp3' },
    { title: 'Forest Reverie 2', artist: 'Artist 7', src: 'https://r2.erweima.ai/suno/d1b4e605-390c-4189-b4c9-66a4d840acdb.mp3' },
    { title: 'Zen Solitude', artist: 'Artist 8', src: 'https://r2.erweima.ai/suno/70b07df9-42ac-49e8-bf84-6bca96a50b5f.mp3' },
    { title: 'Zen Solitude 2', artist: 'Artist 9', src: 'https://r2.erweima.ai/suno/cb5222dc-a495-40b8-a293-5d63bcf726e5.mp3' }

  ];
  useEffect(() => {
    if (address && !isSigned) {
      requestSignature();
    }
  }, [address, isSigned]);
  const requestSignature = async () => {
    if (sdk) {
      try {
        const message = "Please sign this message to confirm your identity.";
        const signature = await sdk.wallet.sign(message);
        console.log("Signature:", signature);
        setIsSigned(true);
      } catch (error) {
        console.error("Error during signing:", error);
      }
    }
  };
  const handleOpenModal = (e) => {
    e.preventDefault();
    console.log('Link clicked');
    setIsOpen(true);
  };

  const generateMusic = async () => {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }
  
    // 确认是否使用$CROAK memecoin支付
    const isConfirmed = confirm("Do you want to use $CROAK memecoin to pay for custom AI music?");
    if (!isConfirmed) {
      return; // 如果用户不同意，直接返回
    }
  
    if (tokenBalance && tokenBalance.displayValue < 1) {
     // alert("You don't have enough $CROAK tokens!");
      //handleOpenModal();
      setIsOpen(true);

      return;
    }
  
    /*
    if (contract) {
      try {
        // 调用智能合约的deductToken方法扣除代币
        await contract.call("deductToken", 1);
        console.log("Token deducted successfully");
        // 扣除成功后，显示AI音乐定制对话框
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to deduct token:", error);
      }
    }*/
  };

  const loadSong = (song) => {
    $('h2.font-bold').text(song.title);
    musicPlayer.play(song);
  };

  const updatePlaylistUI = () => {
    const playlistEl = $('#playlist');
    playlistEl.empty();
    playlist.forEach((song, index) => {
      const isCurrentSong = index === currentSongIndex;
      const li = $('<li>')
        .addClass('mb-2 cursor-pointer')
        .click(() => {
          setCurrentSongIndex(index);
          loadSong(song);
        })
        .toggleClass('text-gray-400', !isCurrentSong)
        .toggleClass('text-white', isCurrentSong)
        .text(`${song.title} - ${song.artist}`);
      playlistEl.append(li);
    });
  };

  const playPause = () => {
    if (musicPlayer.audio.paused) {
      musicPlayer.audio.play();
      showMessage('Play/Resume music');
    } else {
      musicPlayer.audio.pause();
      showMessage('Pause music');
    }
  };

  const prevSong = () => {
    if (playlist.length > 0) {
      const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
      setCurrentSongIndex(prevIndex);
      loadSong(playlist[prevIndex]);
    } else {
      console.log('No song in the playlist.');
    }
  };

  const nextSong = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentSongIndex + 1) % playlist.length;
      setCurrentSongIndex(nextIndex);
      loadSong(playlist[nextIndex]);
    } else {
      console.log('No song in the playlist.');
    }
  };

  const toggleLoop = () => {
    musicPlayer.setLoop(!musicPlayer.audio.loop);
    showMessage(musicPlayer.audio.loop ? 'Enable loop playback' : 'Disable loop playback');
  };

  const stopSong = () => {
    musicPlayer.stop();
    showMessage('Stop playing music');
  };

  useEffect(() => {
    const requestPlayPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPlayPermission(true);
      } catch (err) {
        console.error('Failed to get play permission:', err);
      }
    };

    requestPlayPermission();

    // Initialize playlist with completePlaylist
    setPlaylist(completePlaylist);

    // Load the first song in the playlist
    if (completePlaylist.length > 0) {
      loadSong(completePlaylist[0]);
      setCurrentSongIndex(0);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', function(event) {
        if (event.data === '生成完毕') {
          console.log('收到消息: 生成完毕');
          fire(0.25, { spread: 26, startVelocity: 55 });
          fire(0.2, { spread: 60 });
          fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
          fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          fire(0.1, { spread: 120, startVelocity: 45 });

         /*
          alert("今天你足够幸运得到NFT，点击确定", function() {
            // 假设signNFT是一个异步函数，处理签名逻辑
            useEffect(() => {
              if (address && !isSigned) {
                requestSignature();
              }
            }, [address, isSigned]);
            const requestSignature = async () => {
              if (sdk) {
                try {
                  const message = "Please sign this message to confirm your identity.";
                  const signature = await sdk.wallet.sign(message);
                  console.log("Signature:", signature);
                  setIsSigned(true);
                  const img = document.createElement('img');
            img.src = '/mint.jpg';
            img.alt = 'Mint';
            img.width = 140;
            img.height = 140;
            img.className = 'bg-white p-4 rounded mb-2 shadow hover-card text-black';
            img.onmouseover = () => showNFTInfo(img);
            img.onmouseout = () => hideNFTInfo(img);
  
            const container = document.getElementById('nft-container');
            container.appendChild(img);
  
  
                } catch (error) {
                  console.error("Error during signing:", error);
                }
              }
            };
         
          });*/
          if (window.confirm("今天你足够幸运得到NFT，点击确定")) {
            requestSignature().then(() => {
              const img = document.createElement('img');
              img.src = '/mint.jpg';
              img.alt = 'Mint';
              img.width = 140;
              img.height = 140;
              img.className = 'bg-white p-4 rounded mb-2 shadow hover-card text-black';
              img.onmouseover = () => showNFTInfo(img);
              img.onmouseout = () => hideNFTInfo(img);

              const container = document.getElementById('nft-container');
              container.appendChild(img);
            });
          }


         

          

          if (completePlaylist.length > 0) {
            // add_completePlaylist里随机挑选一首歌添加到compeletPlaylist,然后add_completePlaylist里删除这首歌
      
            updatePlaylists(add_completePlaylist, completePlaylist) ;
            const newSong = completePlaylist.shift();
            setPlaylist((prevPlaylist) => [...prevPlaylist, newSong]);
            loadSong(newSong);
          } else {
            console.log('No more songs to play.');
          }

          if (musicPlayer.audio.paused) {
            musicPlayer.audio.play();
            showMessage('Play/Resume music');
          } else {
            musicPlayer.audio.pause();
            showMessage('Pause music');
          }
        }
      });
    }

    function showMessage(text) {
      $('#message .message-text').text(text);
      $('#message').removeClass('hidden');
    }

    function hideMessage() {
      $('#message').addClass('hidden');
    }

    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {

      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    $('#menuBtn').click(function () {
      $('#menu').toggleClass('hidden md:flex');
    });

    $('#playBtn, #playBtn2').click(playPause);

    $('.control-btn').click(function () {
      const action = $(this).data('action');
      switch (action) {
        case 'prev':
          prevSong();
          break;
        case 'next':
          nextSong();
          break;
        case 'loop':
          toggleLoop();
          break;
        case 'play':
          playPause();
          break;
        case 'stop':
          stopSong();
          break;
        default:
          break;
      }
    });

    $('#closeMessage').click(function () {
      $('#message').addClass('hidden');
    });
  }, []);

  useEffect(() => {
    updatePlaylistUI();
  }, [playlist, currentSongIndex]);

  return (
    <div className="bg-black text-white">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button id="menuBtn" className="mr-4 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">MoodFrog Tunes</h1>
        </div>
        <nav id="menu" className="hidden md:flex space-x-4">
          <div className="inline-block">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={generateMusic}
            >
              定制AI音乐
            </button>
            {isOpen && <CustomModal open={isOpen} onClose={() => setIsOpen(false)} />}
          </div>
          <div className="inline-block">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => setShowIframe(true)}
            >
              心情管理
            </button>

            {showIframe && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded shadow-lg w-800 h-600 relative">
                  <iframe src="/tongji" width="800" height="600"></iframe>
                  <button
                    className="absolute top-0 right-0 m-2 bg-red-500 text-white rounded-full p-2"
                    onClick={() => setShowIframe(false)}
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
          <ConnectWallet>Login</ConnectWallet>
      {address && (
        <div>
          <p>Connected Address: {address}</p>
          {isSigned ? (
            <p>Signature confirmed!</p>
          ) : (
            <p>Please sign the message in your wallet.</p>
          )}
        </div>
      )}
    </div>
        </nav>
        <button id="playBtn" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200">Play</button>
      </header>

      <main className="flex items-center justify-center h-[calc(100vh-64px)] bg-image" style={{ backgroundImage: "url('background.png')" }}>
        <div className="flex-1">
          <div className="flex justify-center">
            <div className="flex-1/3">
              <div className="relative z-4 p-8 bg-black bg-opacity-50 rounded-lg text-center h-full">
                <h2 className="text-4xl font-bold mb-4">Hypnotic Music</h2>
                <button id="playBtn2" className="bg-white text黑 px-8 py-4 rounded-full hover:bg-gray-200 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Play
                </button>
                <div className="mt-8 flex justify-center space-x-4">
                  <button className="control-btn bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300" data-action="prev">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="control-btn bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300" data-action="play">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="control-btn bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300" data-action="next">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="control-btn bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300" data-action="loop">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <button className="control-btn bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors duration-300" data-action="stop">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    </svg>
                  </button>
                </div>
                <div id="playlist" className="mt-8 text-left text-gray-400">
                  {/* 播放列表将在此处生成 */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex-2">
          <div className="relative z-10 p-8 bg-black bg-opacity-50 rounded-lg h-full">
            <h3 className="text-2xl font-bold mb-4">efrogs NFT </h3>
            <div id="nft-container">
              <div className="bg白 p-4 rounded mb-2 shadow hover-card text-black" onMouseOver={() => showNFTInfo(this)} onMouseOut={() => hideNFTInfo(this)}>efrogs NFT 列表</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500">
        &copy; 2023 MoodFrog Tunes. All rights reserved.
      </footer>

      <div id="message" className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg hidden">
        <span id="messageText"></span>
        <button id="closeMessage" className="ml-2 text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
