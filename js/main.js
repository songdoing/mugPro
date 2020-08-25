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
                container : document.querySelector('#scroll-section-0'),
                messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                messageD : document.querySelector('#scroll-section-0 .main-message.d')
            },
            values : {
                messageA_opacity: [0, 1] //시작값, 끝값
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

        //사용자가 새로고침할 경우, currentScene에 현재위치씬을 넣어주기
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i =0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    //currentYOffset:현재 씬에서 얼마나 스크롤됐는지
    function calcValues(values, currentYOffset) {
        let rv; //returned value
        //그 씬안에서 스크롤한 만큼의 비율(0~1)
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
        //끝값- 시작값을 해서 범위를 구하고 scrollRatio를 곱한 다음 시작값을 더함
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        return rv;
    }

    //해당 씬에서만 animation이 움직이도록..
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        //현재 해당씬에 얼마나 스크롤되어 있는지
        const currentYOffset = yOffset - prevScrollHeight;

        //console.log(currentScene, currentYOffset);

        switch (currentScene) {
            case 0:
                //let messageA_opacity_0 = values.messageA_opacity[0]; //시작값
                //let messageA_opacity_1 = values.messageA_opacity[1]; //끝값
                //console.log(calcValues(values.messageA_opacity, currentYOffset)); 0~1까지 스크롤되면 표시 
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
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
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(yOffset < prevScrollHeight) {
            //맨꼭대기에 있을때 브라우저 바운스 효과로 인해 yOffset이 마이너스되는 것을 방지
            if ( currentScene === 0 ) return; 
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
       // console.log(currentScene);
        //console.log(prevScrollHeight);
        
        playAnimation();
    }

    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    //load 될때마다, setLayout함수 다시 실행, load보다 DOMContentLoaded가 이미지,동영상빼기때문에 더 빠름
    //window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load' , setLayout);
    //창사이즈가 변하는 이벤트 생길때마다, setLayout함수 다시 실행
    window.addEventListener('resize', setLayout);

    setLayout();
})();