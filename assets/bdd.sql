#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: users
#------------------------------------------------------------

CREATE TABLE users(
        email      Varchar (250) NOT NULL ,
        password   Varchar (50) NOT NULL ,
        first_name Varchar (50) NOT NULL ,
        name_user  Varchar (50) NOT NULL ,
        date_birth Datetime NOT NULL ,
        img_path   Varchar (250) NOT NULL ,
        token      Varchar (250)
	,CONSTRAINT users_PK PRIMARY KEY (email)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: type_artist
#------------------------------------------------------------

CREATE TABLE type_artist(
        type_artist Varchar (50) NOT NULL
	,CONSTRAINT type_artist_PK PRIMARY KEY (type_artist)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: artist
#------------------------------------------------------------

CREATE TABLE artist(
        id_artist   Int  Auto_increment  NOT NULL ,
        name_artist Varchar (50) NOT NULL ,
        img_path    Varchar (250) NOT NULL ,
        type_artist Varchar (50) NOT NULL
	,CONSTRAINT artist_PK PRIMARY KEY (id_artist)

	,CONSTRAINT artist_type_artist_FK FOREIGN KEY (type_artist) REFERENCES type_artist(type_artist)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: album
#------------------------------------------------------------

CREATE TABLE album(
        id_album       Int  Auto_increment  NOT NULL ,
        name_album     Varchar (50) NOT NULL ,
        date_published Varchar (50) NOT NULL ,
        img_path       Varchar (250) NOT NULL ,
        id_artist      Int NOT NULL
	,CONSTRAINT album_PK PRIMARY KEY (id_album)

	,CONSTRAINT album_artist_FK FOREIGN KEY (id_artist) REFERENCES artist(id_artist)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: album_style
#------------------------------------------------------------

CREATE TABLE album_style(
        style Varchar (50) NOT NULL
	,CONSTRAINT album_style_PK PRIMARY KEY (style)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: tracks
#------------------------------------------------------------

CREATE TABLE tracks(
        id_tracks     Int  Auto_increment  NOT NULL ,
        name_tracks   Varchar (250) NOT NULL ,
        date_listened Date ,
        duration      Int NOT NULL ,
        track_path    Varchar (250) NOT NULL ,
        id_album      Int ,
        id_artist     Int NOT NULL
	,CONSTRAINT tracks_PK PRIMARY KEY (id_tracks)

	,CONSTRAINT tracks_album_FK FOREIGN KEY (id_album) REFERENCES album(id_album)
	,CONSTRAINT tracks_artist0_FK FOREIGN KEY (id_artist) REFERENCES artist(id_artist)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: playlist
#------------------------------------------------------------

CREATE TABLE playlist(
        id_playlist   Int  Auto_increment  NOT NULL ,
        name_playlist Varchar (50) NOT NULL ,
        date_creation Date NOT NULL ,
        img_path      Varchar (250) NOT NULL ,
        email         Varchar (250) NOT NULL
	,CONSTRAINT playlist_PK PRIMARY KEY (id_playlist)

	,CONSTRAINT playlist_users_FK FOREIGN KEY (email) REFERENCES users(email)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: is_style
#------------------------------------------------------------

CREATE TABLE is_style(
        style    Varchar (50) NOT NULL ,
        id_album Int NOT NULL
	,CONSTRAINT is_style_PK PRIMARY KEY (style,id_album)

	,CONSTRAINT is_style_album_style_FK FOREIGN KEY (style) REFERENCES album_style(style)
	,CONSTRAINT is_style_album0_FK FOREIGN KEY (id_album) REFERENCES album(id_album)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: playlist_tracks
#------------------------------------------------------------

CREATE TABLE playlist_tracks(
        id_tracks   Int NOT NULL ,
        id_playlist Int NOT NULL ,
        date_add    Date NOT NULL
	,CONSTRAINT playlist_tracks_PK PRIMARY KEY (id_tracks,id_playlist)

	,CONSTRAINT playlist_tracks_tracks_FK FOREIGN KEY (id_tracks) REFERENCES tracks(id_tracks)
	,CONSTRAINT playlist_tracks_playlist0_FK FOREIGN KEY (id_playlist) REFERENCES playlist(id_playlist)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: favorites_tracks
#------------------------------------------------------------

CREATE TABLE favorites_tracks(
        email     Varchar (250) NOT NULL ,
        id_tracks Int NOT NULL
	,CONSTRAINT favorites_tracks_PK PRIMARY KEY (email,id_tracks)

	,CONSTRAINT favorites_tracks_users_FK FOREIGN KEY (email) REFERENCES users(email)
	,CONSTRAINT favorites_tracks_tracks0_FK FOREIGN KEY (id_tracks) REFERENCES tracks(id_tracks)
)ENGINE=InnoDB;