from app import db
from app.business.models.address import Address
from app.business.models.order import Order
from flask import jsonify

class AddressController:
    @staticmethod
    def get_all():
        addresses = Address.query.all()
        return [address.to_dict() for address in addresses]
    
    @staticmethod
    def get_by_id(address_id):
        address = Address.query.get_or_404(address_id)
        return address.to_dict()
    
    @staticmethod
    def create(data):
        new_address = Address(
            order_id=data.get('order_id'),
            street=data.get('street'),
            city=data.get('city'),
            state=data.get('state'),
            postal_code=data.get('postal_code'),
            additional_info=data.get('additional_info')
        )
        
        db.session.add(new_address)
        db.session.commit()
        
        return new_address.to_dict(), 201
    
    @staticmethod
    def update(address_id, data):
        address = Address.query.get_or_404(address_id)
        
        if 'street' in data:
            address.street = data['street']
        if 'city' in data:
            address.city = data['city']
        if 'state' in data:
            address.state = data['state']
        if 'postal_code' in data:
            address.postal_code = data['postal_code']
        if 'additional_info' in data:
            address.additional_info = data['additional_info']
        
        db.session.commit()
        
        return address.to_dict()
    
    @staticmethod
    def delete(address_id):
        address = Address.query.get_or_404(address_id)
        
        db.session.delete(address)
        db.session.commit()
        
        return {"message": "Address deleted successfully"}, 200
    
    @staticmethod
    def get_by_customer(customer_id):
        # 1. Obtén todas las órdenes del usuario
        orders = Order.query.filter_by(customer_id=customer_id).all()
        order_ids = [order.id for order in orders]
        # 2. Busca todas las direcciones asociadas a esas órdenes
        addresses = Address.query.filter(Address.order_id.in_(order_ids)).all()
        return [address.to_dict() for address in addresses]