import { useRouter } from 'next/router'
import axios from 'axios';
import { useEffect, useState } from 'react';


const extractHtmlFromResponse = (data) => {
    const pages = data.query.pages;
    const firstPageKey = Object.keys(pages)[0];
    const revisions = pages[firstPageKey].revisions;

    if (revisions && revisions.length > 0) {
        return revisions[0]['*'];
    }
    return '';
};



const Wiki = () => {
    const router = useRouter();
    const [content, setContent] = useState('');
    const title = router.query.title;
    var list_of_data;

    useEffect(() => {
        if (title) {
            // Wikipedia APIを叩く
            const fetchContent = async () => {
                try {
                    let continueToken = ''; // 継続トークンを初期化

                    // データのリストを格納するための配列を作成
                    const listOfData = [];
                
                    if(false){//sqlにtitleのやつがあれば

                    }else{
                        const response = await axios.get(`https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=revisions&titles=${title}&rvprop=content&rvparse`);
                        const htmlContent = extractHtmlFromResponse(response.data);
                        setContent(htmlContent);
                        //必ず実行する初回のlinkを得るコマンドと、保存
                        var response_link = await axios.get(`https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=links&titles=${title}&pllimit=500`);
                        // console.log(response_link);
                        var links = response_link.data.query.pages[Object.keys(response_link.data.query.pages)[0]].links;
                        for (const link of links) {//link名をひたすらlistOfDataに
                            listOfData.push(link.title);
                        }
    
                        // 継続トークンがなくなるまでデータを取得するためにwhileループを使用
                        while (response_link.data.hasOwnProperty("continue")) {
                            continueToken = response_link.data.continue.plcontinue;
                            response_link = await axios.get(`https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=links&titles=${title}&plcontinue=${continueToken}&pllimit=500`);
                            // APIリクエストを送信
                            // 追加
                            links = response_link.data.query.pages[Object.keys(response_link.data.query.pages)[0]].links;
                    
                            // リンクを反復処理し、listOfDataに
                            for (const link of links) {//link名をひたすらlistOfDataに
                                listOfData.push(link.title);
                            }
                            
                        }
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                }

            };
            fetchContent();
        }
    }, [title]);

    return (
        <div>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )

}

export default Wiki;

