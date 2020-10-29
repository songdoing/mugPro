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
                messageD : document.querySelector('#scroll-section-0 .main-message.d'),
                canvas : document.querySelector('#video-canvas-0'),
                context : document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages : []
            },
            values : {
                videoImageCount : 300,
                imageSequence : [0, 299],
                canvas_opacity : [1,0,{start:0.9, end:1}],
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
                messageD_translateY_out : [0, -20, { start: 0.85, end : 0.9 }]
            }
        }, 
        {
            //1
            type : 'normal',
            //heightNum : 5, 
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
                container : document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas : document.querySelector('#video-canvas-1'),
                context : document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages : []
            },
            values : {
                videoImageCount : 960,
                imageSequence : [0, 959],
                canvas_opacity_in : [0, 1, {start: 0, end: 0.1}],
                canvas_opacity_out : [1, 0, {start: 0.95, end: 1}],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],

                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],

                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],

                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
				pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },
        {
            //3
            type : 'sticky',
            heightNum : 5, 
            scrollHeight : 0,
            objs : {
                container : document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas : document.querySelector('.image-blend-canvas'),
                context : document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath : [
                    './images/sons.jpg',
                    './images/sons2.jpg'
                ],
                images: []
            },
            values: {
                // 하얀박스의 X좌표 
                rect1X : [0, 0, { start : 0, end : 0 }],
                rect2X : [0, 0, { start : 0, end : 0 }],
                blendHeight : [0, 0, { start : 0, end : 0 }],
                canvas_scale : [0, 0, { start : 0, end : 0 }],
                canvasCaption_opacity: [0,1, {start:0, end:0}],
                canvasCaption_translateY: [20, 0, {start:0, end:0}],
                rectStartY : 0 //top위치값이 한번만 들어가도록,(애니메이션의 시작점)
            }
        }
    ];

    function setCanvasImages() {
        let imgElem;
        for(let i =0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2;
        for(let i =0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3;
        for(let i =0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src= sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }
    setCanvasImages();

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky'){
                //현재 열린 브라우저높이에 heightNum를 곱해서..어느 브라우저나 같은 비율의 scrollHeight를 갖도록
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
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

        // 화면이 어떤 비율이건 간에 높이만 꽉 차게 맞쳐줌 그리고 나서 css에서 가운데 정렬
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
                
                //0~299 까지 정수로 나옴..스크롤되면서
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}
                
                break;
            
            case 2:
                //console.log('2 play');
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                //scene2 마지막부분에 캔버스를 미리 그리고 있어서 스크롤함에 자연스럽게 브렌딩이미지가 올라오도록
                //scene3에 쓰는 캔버스를 복사해온다.
                
                if ( scrollRatio > 0.9) {
                    //변수를 scene3번꺼를 사용함
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                    
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

					if (widthRatio <= heightRatio) {
						// 캔버스보다 브라우저 창이 홀쭉한 경우
						canvasScaleRatio = heightRatio;
					} else {
						// 캔버스보다 브라우저 창이 납작한 경우
						canvasScaleRatio = widthRatio;
					}

					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = 'white';
					objs.context.drawImage(objs.images[0], 0, 0);

					// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
					values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

					// 좌우 흰색 박스 그리기(초기값으로)
					objs.context.fillRect(
						parseInt(values.rect1X[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);
					objs.context.fillRect(
						parseInt(values.rect2X[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);                    
                }
                break;
            case 3:
                //console.log('3 play');
                let step = 0;
                // 가로 세로 모두 꽉 차게 하기 위해 여기서 계산 세팅 필요
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납짝한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);

                //캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                //const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
                // 스크롤바가 자리를 차지하고 있기 때문에, window.innerWidth는 안됨 document.body.offsetWidth를 사용
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                //DOMRect라는 객체를 얻는다.(위치 값들이 나옴) 한번만 top값을 얻도록..
                //문제점 : 스크롤 속도에 따라 값이 skip이 되기때문에 getBoundingClientRect 안 쓸거임
                if(!values.rectStartY) {
                    //values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    //offsetTop은 문서 맨첨부터의 픽셀 (기준선을 section첨으로 하기 위해 부모el를 relative로)
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    //시작점도 설정 : 브라우저의 절반높이 정도 스크롤 될때부터 애니메이션 시작
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight; //end시점의 비율
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                
                //하얀박스의 스펙만들기 (브라우저의 15%정도 양옆에 하얀박스가 스크롤에 따라 X좌표가 바뀜)
                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;  //시작 : (1920 - 브라우저가로길이)/2
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth; //끝 : 시작점 - 하얀박스 폭
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth; //시작점 + 브라우저가로길이 - 하얀박스 폭
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // 다시 하얀박스 폭만큼 더하기

                // 좌우 흰색 박스 그리기
                objs.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)), // X
					0,                                                   // Y
					parseInt(whiteRectWidth),                            // Width
					objs.canvas.height                                   // Height
				);
				objs.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
                /*
				objs.context.fillRect(
					parseInt(values.rect1X[0]),  
					0,                           
					parseInt(whiteRectWidth),    
					objs.canvas.height           
				);
				objs.context.fillRect(
					parseInt(values.rect2X[0]),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
                );
                */
                //캔버스가 브라우저에 닿지 않을때 step =1, 닿을때 step=2
                if( scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    //캔버스 닿기 전
                    objs.canvas.classList.remove('sticky');
                } else {
                    step = 2;
                    //캔버스 닿은 후
                    //이미지 블랜드
                    //blendHeight : [0, 0, {start:0, end:0}]
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height; 
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                    //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight    
                    );
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

                    //축소되기
                    if(scrollRatio > values.blendHeight[2].end) {
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start = values.blendHeight[2].end; 
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0;//다시 올릴때 fixed되믄서 마진탑설정 제거
                    }
                    //fixed풀고(sticky class를 없애기) static으로 스크롤되어 올라가기
                    if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
                        //fixed된 채로 스크롤한 높이동안 margin-top를 넣어줌
                        objs.canvas.classList.remove('sticky'); //fixed해제,fixed인채로 스크롤내린상태가 static상태에선 위에 위치하게됨
                        //fixed된채로(이미지블렌딩, 축소) 스크롤 했기때문에 40%만큼 마진탑을 준다
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start +0.1;
                        values.canvasCaption_translateY[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start +0.1;
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                        objs.canvasCaption.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
                    }
                }
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
    // load 되었을때 setLayout함수 뿐 아니라, 머그컵도 그리도록 세팅(익명함수)
    //window.addEventListener('load' , setLayout);
    window.addEventListener('load' , () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);    
    });
    //창사이즈가 변하는 이벤트 생길때마다, setLayout함수 다시 실행
    window.addEventListener('resize', setLayout);

    setLayout();
})();