/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. 필요한 부품(HTML 요소)들을 변수로 가져오기
    // ============================================================
    const categorySelect = document.getElementById('category-select');
    const timingSelect = document.getElementById('timing-select');
    const generateBtn = document.getElementById('generate-btn');
    
    const abilityText = document.getElementById('ability-text');
    const abilityMeta = document.getElementById('ability-meta');
    const mainIcon = document.getElementById('main-icon');
    const easterEggMsg = document.getElementById('easter-egg-msg');

    // 상세 정보 및 복사 관련 요소들
    const detailsToggleBtn = document.getElementById('details-toggle-btn');
    const detailsContainer = document.getElementById('details-container');
    const descHowToRun = document.getElementById('desc-how-to-run');
    const descNightOrder = document.getElementById('desc-night-order');
    const descNote = document.getElementById('desc-note');
    const noteWrapper = document.getElementById('note-wrapper');
    const copyBtn = document.getElementById('copy-btn'); // 복사 버튼

    // 직전에 뽑은 능력의 ID를 기억할 변수 (중복 방지용)
    let lastGeneratedId = null;

    // ============================================================
    // 2. 초기 세팅: 드롭다운 메뉴 채우기
    // ============================================================
    function initDropdowns() {
        CATEGORY_OPTIONS.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            categorySelect.appendChild(option);
        });

        TIMING_OPTIONS.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            timingSelect.appendChild(option);
        });
    }

    // ============================================================
    // 3. 핵심 기능: 능력 뽑기
    // ============================================================
    function generateAbility() {
        const selectedCategory = categorySelect.value;
        const selectedTiming = timingSelect.value;

        // 1) 필터링
        let filteredData = amnesiacData.filter(item => {
            const categoryMatch = (selectedCategory === 'all') || item.category.includes(selectedCategory);
            const timingMatch = (selectedTiming === 'all') || item.timing.includes(selectedTiming);
            return categoryMatch && timingMatch;
        });

        // 2) 결과 없음 처리
        if (filteredData.length === 0) {
            abilityText.textContent = "조건에 맞는 능력이 없습니다.";
            abilityMeta.textContent = "다른 조건을 선택해 보세요.";
            abilityMeta.classList.remove('hidden');
            
            // 상세 관련 버튼 숨기기
            detailsToggleBtn.classList.add('hidden');
            detailsContainer.classList.add('hidden');
            return;
        }

        // 3) 중복 방지 (직전 능력 제외)
        if (filteredData.length > 1 && lastGeneratedId !== null) {
            filteredData = filteredData.filter(item => item.id !== lastGeneratedId);
        }

        // 4) 랜덤 선택
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        const selectedAbility = filteredData[randomIndex];
        lastGeneratedId = selectedAbility.id;

        // 5) 화면 업데이트 및 효과
        updateDisplay(selectedAbility);
        spinIcon();
    }

    // ============================================================
    // 4. 화면 업데이트 함수
    // ============================================================
    function updateDisplay(item) {
        // 기본 텍스트 표시
        abilityText.textContent = item.ability;
        abilityMeta.textContent = `[${item.category.join(', ')}] ${item.timing.join(', ')}`;
        abilityMeta.classList.remove('hidden');

        // 상세 정보 데이터 채우기 (화면엔 아직 안 보임)
        descHowToRun.textContent = item.howToRun;
        descNightOrder.textContent = item.nightOrder;

        // Note가 있을 때만 표시
        if (item.note && item.note.trim() !== "") {
            descNote.textContent = item.note;
            noteWrapper.style.display = "block";
        } else {
            noteWrapper.style.display = "none";
        }

        // 상세 창 상태 초기화 (닫힘)
        detailsContainer.classList.add('hidden');
        detailsToggleBtn.textContent = "▼ 상세 운영법 보기";
        detailsToggleBtn.classList.remove('hidden');
        
        // 복사 버튼 텍스트 초기화 (혹시 '완료' 상태로 남아있을까봐)
        copyBtn.textContent = "📋 복사하기";
    }

    // ============================================================
    // 5. 버튼 이벤트 (토글 & 복사)
    // ============================================================
    
    // 상세 보기 토글
    detailsToggleBtn.addEventListener('click', () => {
        const isHidden = detailsContainer.classList.contains('hidden');
        if (isHidden) {
            detailsContainer.classList.remove('hidden');
            detailsToggleBtn.textContent = "▲ 닫기";
        } else {
            detailsContainer.classList.add('hidden');
            detailsToggleBtn.textContent = "▼ 상세 운영법 보기";
        }
    });

    // [핵심] 클립보드 복사 기능
    copyBtn.addEventListener('click', () => {
        // 1. 복사할 텍스트 구성 (가독성 좋게 줄바꿈)
        let textToCopy = `[기억상실자 능력]\n${abilityText.textContent}\n\n`;
        textToCopy += `[How to Run]\n${descHowToRun.textContent}\n\n`;
        textToCopy += `[밤 순서]\n${descNightOrder.textContent}`;
        
        // Note가 화면에 보일 때만 텍스트에 포함
        if (noteWrapper.style.display !== "none") {
            textToCopy += `\n\n[Note]\n${descNote.textContent}`;
        }

        // 2. 클립보드에 쓰기
        navigator.clipboard.writeText(textToCopy).then(() => {
            // 성공 피드백 (버튼 글씨 변경)
            const originalText = "📋 복사하기";
            copyBtn.textContent = "✅ 복사 완료!";
            
            // 2초 뒤 원상복구
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        });
    });

    // ============================================================
    // 6. 아이콘 효과 및 기타
    // ============================================================
    function spinIcon() {
        mainIcon.classList.add('super-fast');
        setTimeout(() => {
            mainIcon.classList.remove('super-fast');
        }, 500);
    }

    let clickCount = 0;
    mainIcon.addEventListener('click', () => {
        clickCount++;
        generateAbility(); 
        if (clickCount === 10) {
            easterEggMsg.classList.remove('hidden');
            setTimeout(() => {
                easterEggMsg.classList.add('hidden');
                clickCount = 0;
            }, 2000);
        }
    });

    // 실행 시작
    initDropdowns();
    generateBtn.addEventListener('click', generateAbility);
});