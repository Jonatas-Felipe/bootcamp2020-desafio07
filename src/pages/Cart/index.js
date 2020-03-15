import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatPrice } from '../../utils/format';
import * as CartActions from '../../store/modules/cart/action';

import {
  Container,
  CardCart,
  Product,
  InfoProduct,
  ImageProduct,
  DetailsProduct,
  RemoveButton,
  NameProduct,
  Price,
  InfoProductQtd,
  QtdProduct,
  QtdButton,
  QtdNumber,
  PriceSubTotal,
  Total,
  TextTotal,
  PriceTotal,
  ButtonFinaly,
  TextFinaly,
  EmptyCart,
  EmptyCartText,
} from './styles';

function Cart({ products, total, removeFromCart, updateAmountRequest }) {
  function addAmount(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }

  function removeAmount(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  return (
    <Container>
      <CardCart>
        {products.length ? (
          <>
            <FlatList
              data={products}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <Product>
                  <InfoProduct>
                    <ImageProduct
                      source={{
                        uri: item.image,
                      }}
                    />
                    <DetailsProduct>
                      <NameProduct>{item.title}</NameProduct>
                      <Price>{item.priceFormatted}</Price>
                    </DetailsProduct>
                    <RemoveButton onPress={() => removeFromCart(item.id)}>
                      <Icon name="delete-forever" size={24} color="#7159c1" />
                    </RemoveButton>
                  </InfoProduct>
                  <InfoProductQtd>
                    <QtdProduct>
                      <QtdButton onPress={() => removeAmount(item)}>
                        <Icon
                          name="remove-circle-outline"
                          size={24}
                          color="#7159c1"
                        />
                      </QtdButton>
                      <QtdNumber>{item.amount}</QtdNumber>
                      <QtdButton onPress={() => addAmount(item)}>
                        <Icon
                          name="add-circle-outline"
                          size={24}
                          color="#7159c1"
                        />
                      </QtdButton>
                    </QtdProduct>
                    <PriceSubTotal>{item.subTotal}</PriceSubTotal>
                  </InfoProductQtd>
                </Product>
              )}
            />
            <Total>
              <TextTotal>TOTAL</TextTotal>
              <PriceTotal>{total}</PriceTotal>
            </Total>
            <ButtonFinaly>
              <TextFinaly>FINALIZAR PEDIDO</TextFinaly>
            </ButtonFinaly>
          </>
        ) : (
          <EmptyCart>
            <Icon name="remove-shopping-cart" size={64} color="#eee" />
            <EmptyCartText>Seu carrinho está vazio.</EmptyCartText>
          </EmptyCart>
        )}
      </CardCart>
    </Container>
  );
}

const mapStateToProps = state => ({
  products: state.cart.map(product => ({
    ...product,
    subTotal: formatPrice(product.amount * product.price),
  })),
  total: formatPrice(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
