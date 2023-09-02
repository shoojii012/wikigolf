
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

    useEffect(() => {
        if (title) {
            // Wikipedia APIを叩く
            const fetchContent = async () => {
                try {
                    const response = await axios.get(`https://ja.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=revisions&titles=${title}&rvprop=content&rvparse`);
                    const htmlContent = extractHtmlFromResponse(response.data);
                    setContent(htmlContent);
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

