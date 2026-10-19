import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/layout/PageContainer';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/ui/EmptyState';

export function Cart() {
  const { lines, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
          description="Add some refreshing drinks to get started."
          action={<Link to="/menu" className="btn-primary">Browse Menu</Link>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-4">
          {lines.map((l) => <CartItem key={l.menuItemId} line={l} />)}
        </div>
        <div>
          <CartSummary subtotal={subtotal}>
            <Link to="/checkout" className="btn-primary w-full">Proceed to Checkout</Link>
            <Link to="/menu" className="btn-outline w-full mt-2">Continue Shopping</Link>
          </CartSummary>
        </div>
      </div>
    </PageContainer>
  );
}