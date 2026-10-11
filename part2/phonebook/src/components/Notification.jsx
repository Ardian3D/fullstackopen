const Notification = ({ notice }) => {
  if (!notice) return null
  return <div role="status" className={`notification ${notice.type}`}>
    {notice.message}
  </div>
}

export default Notification
