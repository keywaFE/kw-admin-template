const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  username: state => state.user.username,
  uid: state => state.user.uid,
  permission_routers: state => state.user.permission_routers,
  isAdmin: state => state.user.isAdmin
}
export default getters
