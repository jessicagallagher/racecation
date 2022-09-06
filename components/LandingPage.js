import runners from '../public/runners.svg'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className='w-screen max-w-6xl my-0 mx-auto min-h-screen grid items-center'>
      <div className='mx-auto text-center text-3xl text-primary mt-6'>
        <h1>On your mark...</h1>
        <h1>Get set...</h1>
        <h1 className='italic font-bold'>RACECATION!</h1>
      </div>

      <div className='mx-auto'>
        <Image src={runners} width={500} height={500} />
      </div>
      <div className='mx-auto mb-3'>
        <button>Enter</button>
      </div>
    </div>
  );
}
