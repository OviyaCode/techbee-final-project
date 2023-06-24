import CountUp from 'react-countup'

export default function NumberCounter(){
    
    return(
        <div className='number-counter'>
            <CountUp start={0} end={75} duration={1.5} prefix='0'
                decimals={2}
                formattingFn={(value) => {
                    return value.toLocaleString();
                }}
            />
        </div>
    )
}