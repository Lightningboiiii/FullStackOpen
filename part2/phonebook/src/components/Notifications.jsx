const Notification = ({ message }) => {
    if(message === null){
        return null
    }

    const className = message[1] ? 'message confirmation' : 'message error'

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification
