//익명함수 즉시 호출(전역변수사용을 방지하려고)
(() => {
    let yOffset = 0; //스크롤위치를 담을 변수
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //0,1,2,3 현재 활성환 된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; //새로운 screen 이 시작되는 순간 true
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
                messageA_opacity_in: [0, 1, { start: 0.1, end : 0.2 }], //시작값, 끝값, 스크롤양이 1이 있을때 10%구간만
                messageA_translateY_in : [20, 0, { start: 0.1, end : 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end : 0.3 }],
                messageA_translateY_out : [0, -20, { start: 0.25, end : 0.3 }],

                messageB_opacity_in: [0, 1, { start: 0.3, end : 0.4 }],
                messageB_translateY_in : [20, 0, { start: 0.3, end : 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end : 0.5 }],
                messageB_translateY_out : [0, -20, { start: 0.45, end : 0.5 }],

                messageC_opacity_in: [0, 1, { start: 0.5, end : 0.6 }],
                messageC_translateY_in : [20, 0, { start: 0.5, end : 0.6 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end : 0.7 }],
                messageC_translateY_out : [0, -20, { start: 0.65, end : 0.7 }],

                messageD_opacity_in: [0, 1, { start: 0.7, end : 0.8 }],
                messageD_translateY_in : [20, 0, { start: 0.7, end : 0.8 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end : 0.9 }],
                messageD_translateY_out : [0, -20, { start: 0.85, end : 0.9 }],
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

    //currentYOffset:현재 씬(섹션)안에서 얼마나 스크롤됐는지
    function calcValues(values, currentYOffset) {
        let rv; //returned value

        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        //그 씬안에서 스크롤한 만큼의 비율(0~1)
        const scrollRatio = currentYOffset / scrollHeight;
        
        if (values.length === 3 ) {
            //start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if ( currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            //끝값- 시작값을 해서 범위를 구하고 scrollRatio를 곱한 다음 시작값을 더함
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        
        return rv;
    }


    //해당 씬에서만 animation이 움직이도록..
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        //현재 해당씬에 얼마나 스크롤되어 있는지(현재의 스크롤위치 -  이전 씬들의 높이합)
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        //console.log(currentScene, currentYOffset);

        switch (currentScene) {
            case 0:
                //console.log('0 play');
                //let messageA_opacity_0 = values.messageA_opacity[0]; //시작값0
                //let messageA_opacity_1 = values.messageA_opacity[1]; //끝값1
                //console.log(calcValues(values.messageA_opacity, currentYOffset)); 0~1까지 스크롤되면 표시 
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
                if(scrollRatio <= 0.22) {
                    //in
                    objs.messageA.style.opacity = messageA_opacity_in;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
                } else {
                    //out
                    objs.messageA.style.opacity = messageA_opacity_out;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
                }
                
                break;
            case 1:
                //console.log('1 play');
                break;
            case 2:
                //console.log('2 play');
                break;
            case 3:
                //console.log('3 play');
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
    //console.log(window.pageYOffset);
        prevScrollHeight = 0;
        for (let i =0; i < currentScene; i++) {
            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
        // 0, 3570, 7140, 10710
        }
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++; 
            enterNewScene = true;
            //씬1 중간에 있을때, 화면이 씬2 꼭대기라인에 닿았을때 씬2로 바뀌어야 하므로
            //씬0 + 씬1의 높이가 yOffset보다 커지는 순간임.
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(yOffset < prevScrollHeight) {
            //맨꼭대기에 있을때 브라우저 바운스 효과로 인해 yOffset이 마이너스되는 것을 방지
            if ( currentScene === 0 ) return; 
            currentScene--;
            enterNewScene = true;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
       // console.log(currentScene);
        //console.log(prevScrollHeight);
        if(enterNewScene) return;
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