-- Order Tracking System
-- This extends the existing orders table with tracking capabilities

-- Add tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN tracking_number VARCHAR(50),
ADD COLUMN estimated_delivery DATE,
ADD COLUMN actual_delivery DATE,
ADD COLUMN shipping_address TEXT,
ADD COLUMN tracking_updates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN shipping_method VARCHAR(50) DEFAULT 'standard',
ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0.00;

-- Create order tracking updates table
CREATE TABLE IF NOT EXISTS order_tracking_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_order_tracking_updates_order_id ON order_tracking_updates(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id_status ON orders(user_id, status);

-- RLS Policies for order tracking updates
ALTER TABLE order_tracking_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tracking updates for their orders"
    ON order_tracking_updates FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_tracking_updates.order_id 
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage tracking updates"
    ON order_tracking_updates FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ));

-- Function to generate tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_number IS NULL THEN
        NEW.tracking_number := 'BB' || LPAD(EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT, 10, '0') || UPPER(substring(md5(random()::TEXT), 1, 4));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate tracking numbers
CREATE TRIGGER generate_order_tracking_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_tracking_number();

-- Function to add tracking update
CREATE OR REPLACE FUNCTION add_tracking_update(
    p_order_id UUID,
    p_status VARCHAR(50),
    p_location VARCHAR(100) DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    update_id UUID;
BEGIN
    INSERT INTO order_tracking_updates (order_id, status, location, description)
    VALUES (p_order_id, p_status, p_location, p_description)
    RETURNING id INTO update_id;
    
    -- Update order status if needed
    UPDATE orders 
    SET status = CASE 
        WHEN p_status IN ('Shipped', 'Out for Delivery', 'Delivered') THEN p_status
        ELSE status
    END
    WHERE id = p_order_id;
    
    RETURN update_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
