import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import { formatPrice } from '../../utils/format';
import * as CartActions from '../../store/modules/cart/action';

import {
  Container,
  CardProduct,
  ImageProduct,
  NameProduct,
  Price,
  ButtonAddCart,
  AddIcon,
  QtdAddIcon,
  TextAddIcon,
} from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('/products');
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  handlePress = id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products } = this.state;

    const { amount } = this.props;

    return (
      <Container>
        <FlatList
          horizontal
          data={products}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <CardProduct>
              <ImageProduct source={{ uri: item.image }} />
              <NameProduct>{item.title}</NameProduct>
              <Price>{item.priceFormatted}</Price>
              <ButtonAddCart onPress={() => this.handlePress(item.id)}>
                <AddIcon>
                  <Icon name="add-shopping-cart" size={24} color="#fff" />
                  <QtdAddIcon>{amount[item.id] || 0}</QtdAddIcon>
                </AddIcon>
                <TextAddIcon>Adicionar</TextAddIcon>
              </ButtonAddCart>
            </CardProduct>
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
