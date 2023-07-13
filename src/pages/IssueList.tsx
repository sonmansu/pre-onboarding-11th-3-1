import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getIssuesApi } from '../apis/issues';
import { Link } from 'react-router-dom';
import { IssueContext } from '../contexts/IC';

export default function IssueList() {
  const { issues, getIssues, loading } = useContext(IssueContext);
  const obsRef = useRef(null);
  const [page, setPage] = useState(0);

  const obsHandler = (entries: IntersectionObserverEntry[]) => {
    // 옵저버 콜백함수
    const target = entries[0];

    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(obsHandler, { threshold: 0.4 });

    if (obsRef.current) observer.observe(obsRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    getIssues(page);
  }, [page]);

  console.log('issues :>> ', issues);

  return (
    <div className='max-w-xl m-auto'>
      <p>이슈리스트</p>
      <ul className='divide-y divide-solid'>
        {issues?.map((issue: any, index: any) => (
          <div key={issue.id}>
            <li>
              <Link
                to={`/issue/${issue.id}`}
                className='flex justify-between items-center hover:bg-slate-300  p-3'
              >
                <div>
                  <h2 className='text-base'>{`#${issue.number} ${issue.title}`}</h2>
                  <p className='text-sm'>
                    {`작성자: ${issue.user?.login}, `}
                    {`작성일: ${issue.created_at}`}
                  </p>
                </div>
                <p>{`코멘트: ${issue.comments}`}</p>
                {/* 프로필이미지: issue.user.avatar_url
                    본문: issue.body */}
              </Link>
            </li>
            {index % 5 === 4 && (
              <Link to='https://www.wanted.co.kr/'>
                <img
                  className='m-auto p-5'
                  src='https://image.wanted.co.kr/optimize?src=https%3A%2F%2Fstatic.wanted.co.kr%2Fimages%2Fuserweb%2Flogo_wanted_black.png&w=110&q=100'
                  alt='Ad'
                />
              </Link>
            )}
          </div>
        ))}
        {loading && <div className='spinner'>로딩 중..</div>}
        <li ref={obsRef}></li>
      </ul>
    </div>
  );
}
