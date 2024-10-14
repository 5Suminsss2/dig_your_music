import { useEffect, useState } from "react";
import { music } from "../utils/commons";

const RandomBomb = () => {
  const [currentMusic, setCurrentMusic] = useState<number | null>(null);
  const [musicData, setMusicData] = useState(music);
  const emptyIndices = [5, 6, 9, 10]; // 빈 객체를 넣을 인덱스 목록 (가운데 부분)
  const [clickedData, setClickedData] = useState([]);

  // grid 그리기
  const gridItems = Array.from({ length: 4 }, (_, rowIndex) =>
    Array.from({ length: 4 }, (_, colIndex) => ({ rowIndex, colIndex }))
  ).flat();

  // 랜덤 데이터 추출 함수
  const getRandomMusicData = (data: [], count: number) => {
    // 데이터 복사 후 랜덤으로 섞기
    const shuffled = data.sort(() => 0.5 - Math.random());
    // 5, 6, 9, 10번째는 빈 객체로 삽입
    const result = shuffled.slice(0, count).map((item: [], index: number) => {
      if (emptyIndices.includes(index)) {
        return {};
      }
      return item;
    });
    return result;
  };

  // 뮤직박스 클릭 함수
  const handleMusicClick = (event: number) => {
    setCurrentMusic(event);
  };

  // dig 버튼 클릭 함수
  const handleDigButton = (index: number, title: string) => {
    setClickedData([...clickedData, title]);
    if (emptyIndices.includes(index + 1) || index === 15) {
      // 0부터 15까지의 수 중 [5, 6, 9, 10] + 마지막 을 제외한 배열 생성
      const numbers = Array.from({ length: 16 }, (_, i) => i).filter(
        (num) => ![5, 6, 9, 10].includes(num)
      );
      const totalNumbers = numbers.filter((num) => num !== index);
      // 배열에서 랜덤으로 하나 선택
      let nextIndex = totalNumbers[Math.floor(Math.random() * numbers.length)];

      // 15일 경우 같은 index가 나올 경우 다시 재할당
      if (index === 15 && nextIndex === 15) {
        nextIndex = totalNumbers[Math.floor(Math.random() * numbers.length)];
      }
      setCurrentMusic(nextIndex);
    } else {
      setCurrentMusic(index + 1);
    }
  };

  // bury 버튼 클릭 함수
  const handleBuryButton = (title: string) => {
    console.log("title", title);
    const filteredDatas = musicData.filter((item) => item.title !== title);
    setMusicData(filteredDatas);
  };

  // 첫 진입 시, 랜덤 데이터 추출
  useEffect(() => {
    const randomMusicData = getRandomMusicData(music, 16);
    console.log("randomMusicData", randomMusicData);
    setMusicData(randomMusicData);
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 p-4">
        {gridItems.map(({ rowIndex, colIndex }, index) => {
          // (1,1), (1,2), (2,1), (2,2) 중앙 2x2 칸 병합
          if (rowIndex === 1 && colIndex === 1) {
            return (
              <div
                key={index}
                className={`bg-red-500 ${
                  currentMusic !== 0 && !currentMusic ? "text-6xl" : "text-4xl"
                } font-bold flex justify-start items-end col-span-2 row-span-2 rounded-lg p-4`}
              >
                {!currentMusic && currentMusic !== 0 ? (
                  <>
                    DIG <br />
                    YOUR <br />
                    MUSIC
                  </>
                ) : (
                  <div className="flex flex-col">
                    <iframe
                      width="560"
                      height="315"
                      src={musicData[currentMusic]?.musicVideo}
                      title="YouTube video player"
                      // frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      // referrerpolicy="strict-origin-when-cross-origin"
                      // allowfullscreen
                    ></iframe>

                    {/* <div>{musicData[currentMusic].title}</div> */}
                  </div>
                )}
              </div>
            );
          }

          // 병합된 셀 부분은 빈칸으로 처리
          if (
            (rowIndex === 1 && colIndex === 2) ||
            (rowIndex === 2 && (colIndex === 1 || colIndex === 2))
          ) {
            return null;
          }

          return (
            <div
              key={index}
              data-index={index} // 인덱스를 데이터 속성으로 저장
              className={
                currentMusic !== null && index === currentMusic
                  ? "bg-blue-300 text-gray-800 text-lg flex flex-col justify-center items-center border-gray-400 rounded-lg shadow-innerShadow p-4 h-40 shadow-outerShadow bg-blue-400 transition-all duration-1000 transform scale-105 cursor-pointer"
                  : "bg-blue-300 text-gray-800 text-lg flex flex-col justify-center items-center border-gray-400 rounded-lg shadow-innerShadow p-4 h-40 hover:shadow-outerShadow hover:bg-blue-400 transition-all duration-1000 transform hover:scale-105 cursor-pointer"
              }
              onClick={() => {
                if (!(currentMusic !== null && index === currentMusic)) {
                  handleMusicClick(index); // 조건이 맞을 때만 함수 호출
                }
              }}
            >
              {currentMusic !== null && index === currentMusic ? (
                <div className="flex space-x-4">
                  <div
                    className="py-2 px-3 bg-[#4F46E5] text-[#fff] text-sm font-semibold rounded-md shadow focus:outline-none"
                    onClick={() => {
                      handleDigButton(index, musicData[currentMusic]?.title);
                    }}
                  >
                    DIG!!
                  </div>
                  <div
                    className="py-2 px-3 bg-[#E11D48] text-[#fff] text-sm font-semibold rounded-md shadow focus:outline-none"
                    onClick={() => {
                      handleBuryButton(musicData[currentMusic]?.title);
                    }}
                  >
                    BURY...
                  </div>
                </div>
              ) : (
                <>
                  {console.log("musicData[index]", index, musicData[index])}
                  <div className="font-semibold text-center">
                    {musicData[index]?.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {musicData[index]?.artist}
                  </div>
                  <div className="text-xs text-gray-500">
                    {musicData[index]?.year}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RandomBomb;
