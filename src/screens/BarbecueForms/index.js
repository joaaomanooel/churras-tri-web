import { connect } from 'react-redux';
import * as UserActions from '../../redux/User';
import * as BarbecuesActions from '../../redux/Barbecues';
import { selectors as FetchSelector } from '../../redux/Fetch';
import BarbecueForms from './BarbecueForms';

const mapStateToProps = (state, { match }) => {
  const { id } = match.params;
  const { barbecues = [] } = state.barbecues;
  const barbecue = barbecues.find(b => b._id === id);
  return ({
    loading: FetchSelector.getFetching('ADD_BARBECUES', state),
    error: FetchSelector.getError('ADD_BARBECUES', state),
    barbecues: state.barbecues.barbecues,
    users: state.user.users,
    user: state.user.data,
    barbecue,
  });
};

const mapDispatchToProps = dispatch => ({
  getUsers: dispatch(UserActions.findUsersRequest()),
  addBarbecues: data => dispatch(BarbecuesActions.addBarbecuesRequest(data)),
  updateBarbecues: data => dispatch(BarbecuesActions.updateBarbecuesRequest(data)),
  removeBarbecues: data => dispatch(BarbecuesActions.removeBarbecuesRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BarbecueForms);
