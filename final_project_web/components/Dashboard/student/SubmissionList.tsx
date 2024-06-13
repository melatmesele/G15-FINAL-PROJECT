import React from 'react';
import { useGetAllSubmissionsByIdQuery, Submission } from '../../../store/submissions/get-all-submissions-by-id';
import Link from 'next/link';
import Image from 'next/image';
import Loading from './../../common/Loading';

const SubmissionList: React.FC = () => {
    const { data: submissions, error, isLoading } = useGetAllSubmissionsByIdQuery();
    if (isLoading) return <Loading />;
    if (error) return <div>Error:</div>;

    
    const latestSubmissions = submissions?.slice(-10).reverse(); 
    
    return (
        <div>
            {latestSubmissions?.length === 0 ? (
                <div className="col-span-12 rounded-lg px-5 pb-5 pt-7.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        <Image
                            src="/images/nodata.svg"
                            className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500"
                            alt=""
                            width={12}
                            height={12}
                        />
                        <h3 className="mb-2 text-l font-semibold text-gray-800 dark:text-gray-200">
                            No Submissions Yet
                        </h3>
                        <p className="text-md text-gray-600 dark:text-gray-400">
                            It looks like there are no submissions at the moment!
                        </p>
                    </div>
                </div>
            ) : (
                <table className="w-full">
                    <tbody>
                        {latestSubmissions?.map((submission: Submission) => (
                            <tr
                                key={submission.id}
                                className="bg-white rounded-lg dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                            >
                                <td className="px-6 py-4 font-medium text-gray-500 dark:text-white whitespace-nowrap">
                                    <Link href={`/submissions/${submission.id}`}>
                                        <span className="text-sm">{submission.questionsForId.title}</span>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                {submission.questionsForId?.difficulty === 'easy' && (
                                <span className="text-green-500 bg-green-500 bg-opacity-20 px-4 py-1 rounded-xl ml-2">
                                    Easy
                                </span>
                                )}
                                {submission.questionsForId?.difficulty === 'medium' && (
                                <span className="text-yellow-800 bg-yellow-800 bg-opacity-20 px-4 py-1 rounded-xl">
                                    Medium
                                </span>
                                )}
                                {submission.questionsForId?.difficulty === 'hard' && (
                                <span className="text-red-500 bg-red-500 bg-opacity-20 px-4 py-1 rounded-xl ml-2">
                                    Hard
                                </span>
                                )}
                                </td>
                                <td className="px-6 py-4">
                                    {submission.questionStatus?.status !== null ? (
                                        <Link href={`/submissions/${submission.id}`}>
                                            {submission.questionStatus?.status === 'Accepted' && (
                                            <span style={{ color: 'green' }} className="text-sm">Accepted</span>
                                            )}
                                            {submission.questionStatus?.status === 'Wrong Answer' && (
                                            <span style={{ color: 'red' }} className="text-sm">Wrong Answer</span>
                                            )}
                                            {submission.questionStatus?.status !== 'Accepted' && submission.questionStatus?.status !== 'Wrong Answer' && (
                                            <span style={{ color: 'red' }} className="text-sm">{submission.questionStatus?.status}</span>
                                            )}
                                        </Link>
                                    ) : (
                                        <span className="text-yellow-500 text-sm">Error</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        {submission.questionsForId?.updatedAt && (
                                            <Link href={`/submissions/${submission.id}`}>
                                                <span className="text-sm font-medium text-gray-500">
                                                    {new Date(submission.questionsForId.updatedAt).toLocaleString([], {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SubmissionList;
