// 當頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log('搜尋功能已初始化');
    const searchbar = document.getElementById('searchbar');
    
    if (!searchbar) {
        console.error('找不到搜尋欄元素');
        return;
    }
    
    console.log('成功找到搜尋欄元素');
    
    // 監聽搜尋欄的輸入事件
    searchbar.addEventListener('keypress', function(e) {
        console.log('按鍵事件觸發：', e.key);
        if (e.key === 'Enter') {
            const searchTerm = searchbar.value.trim();
            console.log('搜尋詞：', searchTerm);
            if (searchTerm) {
                // 將搜尋詞儲存到 sessionStorage
                sessionStorage.setItem('searchTerm', searchTerm);
                console.log('搜尋詞已儲存到 sessionStorage');
                // 檢查當前是否在搜尋結果頁面
                if (window.location.pathname.includes('search-results.html')) {
                    // 如果已經在搜尋結果頁面，直接執行搜尋
                    console.log('當前在搜尋結果頁面，直接執行搜尋');
                    performSearch(searchTerm);
                } else {
                    // 如果不在搜尋結果頁面，跳轉到搜尋結果頁面
                    console.log('跳轉到搜尋結果頁面');
                    window.location.href = '../HTML/search-results.html';
                }
            }
        }
    });

    // 如果當前在搜尋結果頁面，執行搜尋
    if (window.location.pathname.includes('search-results.html')) {
        console.log('當前在搜尋結果頁面');
        const searchTerm = sessionStorage.getItem('searchTerm');
        console.log('讀取到的搜尋詞：', searchTerm);
        if (searchTerm) {
            console.log('從 sessionStorage 讀取搜尋詞：', searchTerm);
            searchbar.value = searchTerm;
            performSearch(searchTerm);
        }
    }
});

// 資料庫
const DATABASE = {
    events: [
        {
            id: 'event-item1',
            title: '乙巳年（2025）黃大仙師上契結緣儀式',
            date: '日期：2025 年 6 月 22 日',
            time: '時間：全日',
            image: '../Images/event1.jpg'
        },
        {
            id: 'event-item2',
            title: '乙巳蛇年元宵佳節',
            date: '日期：2025 年 2 月 12 日',
            time: '時間：全日',
            image: '../Images/event2.jpg'
        },
        {
            id: 'event-item3',
            title: '黄大仙祠太岁元辰殿——酬神',
            date: '日期：2024 年 12 月 01 日 - 2025 年 1 月 27 日',
            time: '时间：全日',
            image: '../Images/event3.jpg'
        },
        {
            id: 'event-item4',
            title: '【斗耀香江 星輝南區 ‧讚星禮斗祈福迎祥大法會】',
            date: '日期：2024 年 10 月 27 日',
            time: '時間：全日',
            image: '../Images/event4.jpg'
        },
        {
            id: 'event-item5',
            title: '2024年新春祈福法會',
            date: '日期：2024 年 4 月 20 日 - 2024 年 5 月 05 日',
            time: '时间：全日',
            image: '../Images/event5.jpg'
        },
    ],
    news: [
        {
            id: 'news-item1',
            title: '嗇色園醫療服務委員會主辦「認識認知障礙症」講座',
            date: '2025 年 2 月 26 日',
            image: '../images/news1.jpg'
        },
        {
            id: 'news-item2',
            title: '嗇色園中醫贈醫施藥100周年紀慶活動之「贈醫百年 恩澤萬家」地區巡迴展覽',
            date: '2024 年 12 月 04 日',
            image: '../images/news2.jpg'
        },
        {
            id: 'news-item3',
            title: '嗇色園與脊骨肌腱痛症關注協會及香港城市獅子會合辦「膝關節痛」健體操及食療講座工作坊',
            date: '2024 年 11 月 21 日',
            image: '../images/news3.jpg'
        },
        {
            id: 'news-item4',
            title: '2024年冬季三九天灸保健計劃 現已接受報名',
            date: '2024 年 11 月 19 日',
            image: '../images/news4.jpg'
        },   
        {
            id: 'news-item5',
            title: '嗇色園中醫贈醫施藥100周年紀慶活動之「耳穴保健」健康推廣',
            date: '2024 年 9 月 19 日',
            image: '../images/news5.png'
        }         
    ]
};

// 執行搜尋
function performSearch(searchTerm) {
    try {
        console.log('開始執行搜尋，搜尋詞：', searchTerm);
        
        // 搜尋結果陣列
        const results = [];

        // 搜尋活動
        DATABASE.events.forEach(event => {
            const allText = [event.title, event.date, event.time].join(' ');
            if (allText.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    type: '活動',
                    title: event.title,
                    content: [event.date, event.time],
                    image: event.image
                });
            }
        });

        // 搜尋新聞
        DATABASE.news.forEach(news => {
            const allText = [news.title, news.date].join(' ');
            if (allText.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    type: '新聞',
                    title: news.title,
                    content: [news.date],
                    image: news.image
                });
            }
        });

        console.log('搜尋完成，找到 ' + results.length + ' 個結果');
        
        // 顯示搜尋結果
        displayResults(results);

    } catch (error) {
        console.error('搜尋過程發生錯誤：', error);
        showNoResults();
    }
}

// 高亮顯示搜尋關鍵字
function highlightSearchTerm(text, searchTerm) {
    if (!text || !searchTerm) return text;
    try {
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        return text.replace(regex, match => `<span class="highlight">${match}</span>`);
    } catch (error) {
        console.error('高亮處理時發生錯誤：', error);
        return text;
    }
}

// 顯示搜尋結果
function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    const noResultsDiv = document.getElementById('no-results');

    if (!resultsContainer || !noResultsDiv) {
        console.error('找不到必要的 DOM 元素');
        return;
    }

    if (results.length === 0) {
        console.log('沒有找到搜尋結果');
        showNoResults();
        return;
    }

    console.log('開始顯示搜尋結果');

    const searchTerm = sessionStorage.getItem('searchTerm');
    resultsContainer.innerHTML = results.map(result => `
        <div class="search-item">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <img src="${result.image || '../images/default.jpg'}" alt="${result.title}" class="img-fluid rounded search-image">
                </div>
                <div class="col-md-8">
                    <div class="search-type-badge ${result.type === '活動' ? 'event-badge' : 'news-badge'}">
                        ${result.type}
                    </div>
                    <h3 class="search-title">${highlightSearchTerm(result.title, searchTerm)}</h3>
                    <div class="search-content">
                        ${result.content.map(text => `<p>${highlightSearchTerm(text, searchTerm)}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    resultsContainer.style.display = 'block';
    noResultsDiv.style.display = 'none';
    console.log('搜尋結果顯示完成');
}

// 顯示無結果訊息
function showNoResults() {
    const resultsContainer = document.getElementById('results-container');
    const noResultsDiv = document.getElementById('no-results');

    if (!resultsContainer || !noResultsDiv) {
        console.error('找不到必要的 DOM 元素');
        return;
    }

    resultsContainer.style.display = 'none';
    noResultsDiv.style.display = 'block';
    console.log('顯示無結果訊息');
} 