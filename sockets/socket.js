const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Prado' ) );
bands.addBand( new Band( 'Maddona' ) );
bands.addBand( new Band( 'Metallica' ) );
bands.addBand( new Band( 'U2' ) );

console.log(bands);

//mensajes sockets

io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje',payload);

        io.emit( 'mensaje', { admin : 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id); 
        io.emit('active-bands', bands.getBands() );
    });

    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name );
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands() );
    });


    client.on('delete-band', (payload) => {
        const newBand = new Band( payload.name );
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands() );
    });

    // client.on('emitir-mensaje', (payload) =>
    // { 
    //     //io.emit('emitir-mensaje', payload); //emite a todos

    //     client.broadcast.emit('nuevo-mensaje',payload); //emite a todos, menos al que emite
    //     //console.log(payload);
    // });



  });
