//익명함수 즉시 호출(전역변수사용을 방지하려고)
(() => {
    let yOffset = 0; //스크롤위치를 담을 변수
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //0,1,2,3 현재 활성환 된(눈 앞에 보고있는) 씬(scroll-section)
    
    //스크롤 구간을 4개의 객체로 나눠서 배열로 담는다.
    const sceneInfo = [
        {
            //0
            type : 'sticky',
            heightNum : 5, //각기 다른브라우저 높이의 5배로 scrollHeight 세팅하고자
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-0')
            }
        }, 
        {
            //1
            type : 'normal',
            heightNum : 5, 
            scrollHeight : 0,
            //해당 섹션을 객체로 담기
            objs : {
                container : document.querySelector('#scroll-section-1')
            }
        },
        {
            //2
            type : 'sticky',
            heightNum : 5, 
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-2')
            }
        },
        {
            //3
            type : 'sticky',
            heightNum : 5, 
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            //현재 열린 브라우저높이에 heightNum를 곱해서..어느 브라우저나 같은 비율의 scrollHeight를 갖도록
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            //각 class scroll-section의 값을 가져와서 거기다 style height를 넣는다
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
    }

    
    function scrollLoop() {
    //console.log(window.pageYOffset);
        prevScrollHeight = 0;
        for (let i =0; i < currentScene; i++) {
            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
        // 0, 3570, 7140, 10710
        }
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
            //씬1 중간에 있을때, 화면이 씬2 꼭대기라인에 닿았을때 씬2로 바뀌어야 하므로
            //씬0 + 씬1의 높이가 yOffset보다 커지는 순간임.
        }
        if(yOffset < prevScrollHeight) {
            //맨꼭대기에 있을때 브라우저 바운스 효과로 인해 yOffset이 마이너스되는 것을 방지
            if ( currentScene === 0 ) return 
            currentScene--;
        }
        console.log(currentScene);
        console.log(prevScrollHeight);
        
    }

    //창사이즈가 변하는 이벤트 생길때마다, setLayout함수 다시 실행
    window.addEventListener('resize', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();