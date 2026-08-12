Parámetros obligatorios
Los siguientes son los parámetros obligatorios que debes tener en cuenta para crear una transacción:

public-key (Llave pública de comercio): Llave pública de comercio.
currency (Moneda): Moneda en la que vas a hacer el cobro. La única moneda disponible actualmente es COP (pesos colombianos).
amount-in-cents (Monto en centavos): Monto a cobrar, en centavos. Por ejemplo si deseas cobrar $95.000 COP, deberás ingresar: 9500000
reference (Referencia única de pago): Referencia única de pago.
signature:integrity (Firma de integridad): Es un hash criptográfico que utilizamos para validar la integridad de la información de la transacción y evitar alteraciones.