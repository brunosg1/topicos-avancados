package br.edu.utfpr.api.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_pessoa")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name= "nome", nullable = false, length = 100)
    private String nome;
    @Column(name= "sobrenome", nullable = false, length = 100)
    private String sobrenome;
    
    @Column(name= "email", nullable = false, length = 90)
    private String email;    
}
